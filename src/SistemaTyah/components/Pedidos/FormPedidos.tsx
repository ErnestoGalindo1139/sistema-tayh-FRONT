/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
  IFormPedidos,
  IModelos,
  ITallas,
  IColores,
  ITipoTelas,
  ITipoPrendas,
  IViaContactoCombo,
  IPedidos,
  IFiltrosPedidos,
} from '../../interfaces/interfacesPedidos';
import {
  Datepicker,
  Label,
  Select,
  TextInput,
  DatepickerRef,
} from 'flowbite-react';
import { customDatePickerTheme } from '../../themes/customDatePickerTheme';
import { IApiError } from '../../interfaces/interfacesApi';
import Toast from '../Toast';
import {
  createPedidos,
  getColores,
  getIdPedido,
  getModelos,
  getPedidos,
  getTallas,
  getTipoPrendas,
  getTipoTelas,
  getViasContactoCombo,
  updatePedidos,
} from '../../helpers/apiPedidos';
import { calcularPrecioUnitarioHelper } from '../../helpers/pedidos/calcularPrecioUnitarioHelper';
import { Button } from '@chakra-ui/react';
import { ModalConfirmacionAgregar } from '../../dialogs/ModalConfirmacionAgregar';
import { getClientesCombo } from '../../helpers/apiClientes';
import { IClientes } from '../../interfaces/interfacesClientes';
import { WaitScreen } from '../WaitScreen';
import { IEstatus } from '../../interfaces/interfacesEstatus';

interface IFormPedidosProps {
  setSn_Agregar: React.Dispatch<React.SetStateAction<boolean>>;
  setSn_Editar: React.Dispatch<React.SetStateAction<boolean>>;
  setSn_Visualizar: React.Dispatch<React.SetStateAction<boolean>>;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
  row: IFormPedidos;
  actualizarPedidos: (pedidos: IPedidos[]) => void;
  filtros: IFiltrosPedidos;
  estatusPedidos: IEstatus[];
}

export const FormPedidos = ({
  setSn_Agregar,
  setSn_Editar,
  setSn_Visualizar,
  sn_Editar,
  sn_Visualizar,
  row,
  actualizarPedidos,
  filtros,
  estatusPedidos,
}: IFormPedidosProps): React.JSX.Element => {
  const [formPedidos, setFormPedidos] = useState<IFormPedidos>({
    ...row,
  });

  const [clientes, setClientes] = useState<IClientes[]>([]);
  const [viasContacto, setViasContacto] = useState<IViaContactoCombo[]>([]);
  const [modelos, setModelos] = useState<IModelos[]>([]);
  const [tallas, setTallas] = useState<ITallas[]>([]);
  const [colores, setColores] = useState<IColores[]>([]);
  const [tipoTelas, setTipoTelas] = useState<ITipoTelas[]>([]);
  const [tipoPrendas, setTipoPrendas] = useState<ITipoPrendas[]>([]);

  // Referencias al Pedido en General
  const fh_PedidoRef = useRef<DatepickerRef>(null);
  const fh_EnvioProduccionRef = useRef<DatepickerRef>(null);
  const fh_EntregaEstimadaRef = useRef<DatepickerRef>(null);
  const id_ClienteRef = useRef<HTMLSelectElement>(null);
  const id_EstatusRef = useRef<HTMLSelectElement>(null);
  const id_ViaContactoRef = useRef<HTMLSelectElement>(null);
  const de_ViaContactoRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cerrarFormulario, setCerrarFormulario] = useState(false);

  // Referencias al Detalle del Pedido
  const de_GeneroRef = useRef<HTMLSelectElement>(null);
  const id_ModeloRef = useRef<HTMLSelectElement>(null);
  const id_TallaRef = useRef<HTMLSelectElement>(null);
  const id_ColorRef = useRef<HTMLSelectElement>(null);
  const id_TipoTelaRef = useRef<HTMLSelectElement>(null);
  const id_TipoPrendaRef = useRef<HTMLSelectElement>(null);
  const de_ConceptoRef = useRef<HTMLInputElement>(null);
  const nu_CantidadRef = useRef<HTMLInputElement>(null);
  const im_PrecioUnitarioRef = useRef<HTMLInputElement>(null);
  const im_SubTotalRef = useRef<HTMLInputElement>(null);
  const im_ImpuestoRef = useRef<HTMLSelectElement>(null);
  const im_TotalRef = useRef<HTMLInputElement>(null);

  // Estados relacionados con Pedido en General
  const [fechaPedidoValida, setFechaPedidoValida] = useState(true);
  const [fechaEnvioValida, setFechaEnvioValida] = useState(true);
  const [fechaEntregaValida, setFechaEntregaValida] = useState(true);
  const [clienteValido, setClienteValido] = useState(true);
  const [estatusValido, setEstatusValido] = useState(true);
  const [viaContactoValida, setViaContactoValida] = useState(true);
  const [DescripcionContactoValida, setDescripcionContactoValida] =
    useState(true);

  // Estados relacionados con Detalle del Pedido
  const [generoValido, setGeneroValido] = useState(true);
  const [modeloValido, setModeloValido] = useState(true);
  const [tallaValida, setTallaValida] = useState(true);
  const [colorValido, setColorValido] = useState(true);
  const [tipoTelaValida, setTipoTelaValida] = useState(true);
  const [tipoPrendaValida, setTipoPrendaValida] = useState(true);
  const [conceptoValido, setConceptoValido] = useState(true);
  const [cantidadValida, setCantidadValida] = useState(true);
  const [precioValido, setPrecioValido] = useState(true);
  const [subtotalValido, setSubtotalValido] = useState(true);
  const [impuestoValido, setImpuestoValido] = useState(true);
  const [totalValido, setTotalValido] = useState(true);

  useEffect(() => {
    const fetchClientes = async (): Promise<void> => {
      try {
        const clientesData = await getClientesCombo(); // Modulo de Pedidos
        setClientes(clientesData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    setFormPedidos({
      ...formPedidos,
      de_ViaContacto: '',
    });
  }, [formPedidos.id_ViaContacto]);

  useEffect(() => {
    const fetchViasContacto = async (): Promise<void> => {
      try {
        const viasContactoData = await getViasContactoCombo(); // Modulo de Pedidos
        setViasContacto(viasContactoData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      }
    };

    fetchViasContacto();
  }, []);

  useEffect(() => {
    const fetchModelos = async (): Promise<void> => {
      try {
        const modelosData = await getModelos(formPedidos.de_Genero); // Modulo de Pedidos
        setModelos(modelosData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      }
    };

    fetchModelos();
  }, [formPedidos.de_Genero]);

  useEffect(() => {
    const fetchTallas = async (): Promise<void> => {
      try {
        const tallasData = await getTallas(); // Modulo de Pedidos
        setTallas(tallasData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      }
    };

    fetchTallas();
  }, []);

  useEffect(() => {
    const fetchColores = async (): Promise<void> => {
      try {
        const coloresData = await getColores(formPedidos.de_Genero); // Modulo de Pedidos
        setColores(coloresData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      }
    };

    fetchColores();
  }, [formPedidos.de_Genero]);

  useEffect(() => {
    const fetchTipoTelas = async (): Promise<void> => {
      try {
        const tipoTelasData = await getTipoTelas(); // Modulo de Pedidos
        setTipoTelas(tipoTelasData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      }
    };

    fetchTipoTelas();
  }, []);

  useEffect(() => {
    const fetchTipoPrendas = async (): Promise<void> => {
      try {
        const tipoPrendasData = await getTipoPrendas();
        setTipoPrendas(tipoPrendasData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      }
    };

    fetchTipoPrendas();
  }, []);

  useEffect(() => {
    const fetchIdPedido = async (): Promise<void> => {
      try {
        if (!sn_Editar) {
          const idPedido = await getIdPedido(formPedidos); // Modulo de Pedidos

          setFormPedidos({
            ...formPedidos,
            id_Pedido: idPedido.body,
          });
        }
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      }
    };

    fetchIdPedido();
  }, []);

  useEffect(() => {
    // Calcular el SubTotal
    const im_SubTotal = formPedidos.nu_Cantidad * formPedidos.im_PrecioUnitario;

    setFormPedidos({
      ...formPedidos,
      im_SubTotal,
    });
  }, [formPedidos.nu_Cantidad, formPedidos.im_PrecioUnitario]);

  useEffect(() => {
    // Calcular el Total y redondearlo a 2 decimales
    const im_Total = parseFloat(
      (formPedidos.im_SubTotal * (1 + formPedidos.im_Impuesto)).toFixed(2)
    );

    setFormPedidos({
      ...formPedidos,
      im_Total,
    });
  }, [formPedidos.im_SubTotal, formPedidos.im_Impuesto]);

  // Convertir el string de fecha 'yyyy-MM-dd' a un objeto Date antes de pasarlo al Datepicker
  const getDateForPicker = (dateString: string): Date | null => {
    if (!dateString) return null; // Si no hay valor, retorna null
    const [year, month, day] = dateString.split('-');
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + 1)); // Convertir string 'yyyy-MM-dd' a un objeto Date ajustado a UTC
  };

  const handleDateChange = (date: Date | null, fieldName: string): void => {
    if (date) {
      // Ajusta la fecha para evitar el desfase de zona horaria (mantener en zona local)
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      ); // Ajuste de zona horaria

      // Convierte la fecha a formato 'yyyy-MM-dd'
      const formattedDate = localDate.toISOString().split('T')[0];

      // Actualiza el estado del campo correspondiente
      setFormPedidos({
        ...formPedidos,
        [fieldName]: formattedDate, // Usa el nombre del campo dinámicamente
      });
    } else {
      setFormPedidos({
        ...formPedidos,
        [fieldName]: '', // Si no hay fecha seleccionada, limpia el campo correspondiente
      });
    }
  };

  const obtenerPrecioUnitario = async (
    target: HTMLSelectElement
  ): Promise<void> => {
    const { name, value } = target;

    // Actualizamos el campo correspondiente en el estado
    setFormPedidos((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Llamamos a la función para obtener el nuevo precio unitario
    const calculo = await calcularPrecioUnitarioHelper({
      ...formPedidos,
      [name]: value,
    });

    // Actualizamos el estado con el nuevo precio unitario
    setFormPedidos((prev) => ({
      ...prev,
      im_PrecioUnitario: calculo.body,
    }));
  };

  const validarNumeroNegativo = (
    numero: string | number,
    ref: React.RefObject<HTMLElement>,
    setValido: React.Dispatch<React.SetStateAction<boolean>>,
    campoNombre: string
  ): boolean => {
    const valor = Number(numero);
    if (isNaN(valor)) {
      ref.current?.focus();
      setValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoNombre} no es un número válido`,
        text: `Por favor ingresa un valor numérico en ${campoNombre}.`,
      });
      return false;
    }

    if (valor == 0) {
      ref.current?.focus();
      setValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoNombre} no puede ser 0`,
        text: `Por favor ingresa una Cantidad Válida`,
      });
      return false;
    }

    if (valor < 0) {
      ref.current?.focus();
      setValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoNombre} no puede ser negativo`,
        text: `Por favor ingresa una Cantidad Válida`,
      });
      return false;
    }

    setValido(true);
    return true;
  };

  const validarDatosFormulario = (cerrarForm: boolean = true): void => {
    // Campos Nulos o Vacíos
    if (
      !validarCampo(
        formPedidos.id_Cliente,
        id_ClienteRef,
        setClienteValido,
        'Cliente'
      ) ||
      !validarCampo(
        formPedidos.id_Estatus,
        id_EstatusRef,
        setEstatusValido,
        'Estatus'
      ) ||
      !validarCampo(
        formPedidos.fh_Pedido,
        fh_PedidoRef,
        setFechaPedidoValida,
        'Fecha de Pedido'
      ) ||
      !validarCampo(
        formPedidos.fh_EnvioProduccion,
        fh_EnvioProduccionRef,
        setFechaEnvioValida,
        'Fecha Envío a Producción'
      ) ||
      !validarCampo(
        formPedidos.fh_EntregaEstimada,
        fh_EntregaEstimadaRef,
        setFechaEntregaValida,
        'Fecha Entrega Estimada'
      ) ||
      !validarCampo(
        formPedidos.id_ViaContacto,
        id_ViaContactoRef,
        setViaContactoValida,
        'Via de Contacto'
      ) ||
      !validarCampo(
        formPedidos.de_Concepto,
        de_ConceptoRef,
        setConceptoValido,
        'Concepto'
      ) ||
      !validarCampo(
        formPedidos.de_Genero,
        de_GeneroRef,
        setGeneroValido,
        'Genero'
      ) ||
      !validarCampo(
        formPedidos.id_Modelo,
        id_ModeloRef,
        setModeloValido,
        'Modelo'
      ) ||
      !validarCampo(
        formPedidos.id_TipoPrenda,
        id_TipoPrendaRef,
        setTipoPrendaValida,
        'Tipo Prenda'
      ) ||
      !validarCampo(
        formPedidos.id_Talla,
        id_TallaRef,
        setTallaValida,
        'Talla'
      ) ||
      !validarCampo(
        formPedidos.id_Color,
        id_ColorRef,
        setColorValido,
        'Color'
      ) ||
      !validarCampo(
        formPedidos.id_TipoTela,
        id_TipoTelaRef,
        setTipoTelaValida,
        'Tipo Tela'
      ) ||
      !validarCampo(
        formPedidos.nu_Cantidad,
        nu_CantidadRef,
        setCantidadValida,
        'Cantidad'
      ) ||
      !validarCampo(
        formPedidos.im_PrecioUnitario,
        im_PrecioUnitarioRef,
        setPrecioValido,
        'Precio'
      ) ||
      !validarCampo(
        formPedidos.im_SubTotal,
        im_SubTotalRef,
        setSubtotalValido,
        'SubTotal'
      ) ||
      !validarCampo(
        formPedidos.im_Impuesto,
        im_ImpuestoRef,
        setImpuestoValido,
        'Impuesto'
      ) ||
      !validarCampo(formPedidos.im_Total, im_TotalRef, setTotalValido, 'Total')
    ) {
      return;
    }

    // Validaciones más especificas

    // Fecha de Envio a producción no puede ser menor a la del pedido
    if (
      !validarRangoFechas(
        formPedidos.fh_Pedido,
        formPedidos.fh_EnvioProduccion,
        fh_PedidoRef,
        fh_EnvioProduccionRef,
        setFechaEnvioValida,
        'Fecha Pedido',
        'Fecha Envío a Producción'
      )
    ) {
      return;
    }

    // Fecha de Entrega Estimada no puede ser menor a la de Producción
    if (
      !validarRangoFechas(
        formPedidos.fh_EnvioProduccion,
        formPedidos.fh_EntregaEstimada,
        fh_EnvioProduccionRef,
        fh_EntregaEstimadaRef,
        setFechaEntregaValida,
        'Fecha Envío a Producción',
        'Fecha Entrega Estimada'
      )
    ) {
      return;
    }

    // No se puede agragar Cantidad Negativa
    if (
      !validarNumeroNegativo(
        formPedidos.nu_Cantidad,
        nu_CantidadRef,
        setCantidadValida,
        'Cantidad'
      )
    ) {
      return;
    }

    // Validar que si se eligió una vía de contacto (Online u Otros), tenga valor la especificación
    if (formPedidos.id_ViaContacto == 1 || formPedidos.id_ViaContacto == 6) {
      if (
        !validarCampo(
          formPedidos.de_ViaContacto,
          de_ViaContactoRef,
          setDescripcionContactoValida,
          'Vía de Contacto'
        )
      ) {
        return;
      }
    }

    if (formPedidos.id_ViaContacto != 1 && formPedidos.id_ViaContacto != 6) {
      setFormPedidos({
        ...formPedidos,
        de_ViaContacto: '',
      });
    }

    setCerrarFormulario(cerrarForm);

    // Abrir Modal de confirmación una vez pasadas las validaciones
    abrirModalConfirmacion();
  };

  const guardarPedido = async (): Promise<void> => {
    let response;

    setIsLoading(true);
    cerrarModalConfirmacion();

    try {
      // Armar el Payload
      const payload = {
        ...formPedidos,
      };

      if (sn_Editar) {
        // Si es editar, llama a updateClientes
        response = await updatePedidos(payload);
      } else {
        // Si es crear, llama a createClientes
        response = await createPedidos(payload);
      }

      // Si la respuesta no es exitosa, mostrar un error
      if (!response.success) {
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: response.message,
        });
        setIsLoading(false);
        return;
      }

      // Mostrar mensaje de éxito
      Toast.fire({
        icon: 'success',
        title: 'Operación exitosa',
        text: response.message,
      });

      setIsLoading(false);

      // Actualizar las categorias
      // const pedidosData = await getPedidos({});
      // actualizarClientes(pedidosData.body);

      // Realizar Petición a la BD
      // Una Vez que se guarda en BD, se limpia el Formulario

      if (cerrarFormulario) {
        setSn_Agregar(false);
        setSn_Visualizar(false);
        setSn_Editar(false);
        // Actualizar los clientes
        const pedidosData = await getPedidos(filtros);
        actualizarPedidos(pedidosData.body);
      }

      limpiarFormulario();
    } catch (error) {
      // Mostrar Alerta en caso de algún error
      console.error(error);
      setIsLoading(false);
      abrirModalConfirmacion();
    }
  };

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

  const limpiarFormulario = (): void => {
    setFormPedidos({
      id_Pedido: formPedidos.id_Pedido,
      id_Cliente: 0,
      fh_Pedido: '',
      fh_EnvioProduccion: '',
      fh_EntregaEstimada: '',
      id_ViaContacto: 0,
      de_ViaContacto: '',
      id_Estatus: '',
      de_Estatus: '',
      id_Modelo: '',
      id_Talla: '',
      id_Color: '',
      id_TipoTela: '',
      id_TipoPrenda: '',
      de_Concepto: '',
      nu_Cantidad: 0,
      im_PrecioUnitario: 0,
      im_SubTotal: 0,
      im_Impuesto: 0,
      im_Total: 0,
      de_Genero: '',
    });
  };

  const validarCampo = (
    campo: string | number,
    ref: React.RefObject<HTMLElement>,
    setValido: React.Dispatch<React.SetStateAction<boolean>>,
    campoNombre: string
  ): boolean => {
    if (!campo) {
      ref.current?.focus();
      setValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoNombre} es obligatorio`,
        text: `Por favor completa el campo ${campoNombre}.`,
      });
      return false;
    }
    setValido(true);
    return true;
  };

  const validarRangoFechas = (
    fechaInicio: Date | string,
    fechaFin: Date | string,
    refInicio: React.RefObject<HTMLElement>,
    refFin: React.RefObject<HTMLElement>,
    setValido: React.Dispatch<React.SetStateAction<boolean>>,
    nombreFechaInicio: string,
    nombreFechaFin: string
  ): boolean => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      const campoInvalido = isNaN(inicio.getTime())
        ? nombreFechaInicio
        : nombreFechaFin;
      const refInvalido = isNaN(inicio.getTime()) ? refInicio : refFin;

      refInvalido.current?.focus();
      setValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoInvalido} no es una fecha válida`,
        text: `Por favor selecciona una fecha válida para ${campoInvalido}.`,
      });
      return false;
    }

    if (fin < inicio) {
      refFin.current?.focus();
      setValido(false);
      Toast.fire({
        icon: 'error',
        title: `Rango de fechas no válido`,
        text: `${nombreFechaFin} no puede ser menor que ${nombreFechaInicio}.`,
      });
      return false;
    }

    setValido(true);
    return true;
  };

  return (
    <div>
      {isLoading && <WaitScreen message="Guardando..." />}
      <div className="dark:bg-[#020405] py-4 rounded-lg">
        <h2 className="font-bold text-[2.5rem] dark:text-white">
          Agregar Pedido
        </h2>
      </div>

      {/* Datos Generales del Pedido */}
      <div>
        <p className="mt-[1.5rem] text-[1.8rem] font-semibold">
          Datos generales del Pedido
        </p>
        <div className="mt-[2rem] grid sm:grid-cols-3 gap-x-[2.5rem] gap-y-[1.2rem]">
          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Folio de Pedido</Label>
            <TextInput
              disabled={sn_Visualizar}
              readOnly
              type="text"
              placeholder="Folio de Pedido"
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              value={formPedidos.id_Pedido}
              onChange={(e) =>
                setFormPedidos({
                  ...formPedidos,
                  id_Pedido: Number(e.target.value),
                })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#F5F5F5',
              }}
              sizing="lg"
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Cliente
            </Label>
            <Select
              disabled={sn_Visualizar}
              ref={id_ClienteRef}
              value={formPedidos.id_Cliente}
              color={`${clienteValido ? '' : 'failure'}`}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${modeloValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="id_Cliente"
              name="id_Cliente"
              onChange={(e) => {
                setFormPedidos({
                  ...formPedidos,
                  id_Cliente: Number(e.target.value),
                });
              }}
              onBlur={() => setClienteValido(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option
                className="dark:text-black"
                value=""
                disabled={!!formPedidos.id_Cliente}
              >
                Seleccione un Cliente
              </option>
              {clientes && clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <option
                    className="dark:text-black"
                    key={cliente.id_Cliente}
                    value={cliente.id_Cliente}
                  >
                    {cliente.nb_Cliente}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Estatus
            </Label>
            <Select
              disabled={sn_Visualizar}
              ref={id_EstatusRef}
              color={`${estatusValido ? '' : 'failure'}`}
              value={formPedidos.id_Estatus}
              onChange={(e) => {
                setFormPedidos({
                  ...formPedidos,
                  id_Estatus: e.target.value,
                });
              }}
              onBlur={() => setEstatusValido(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${estatusValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
            >
              {estatusPedidos && estatusPedidos.length > 0 ? (
                estatusPedidos.map((estatus) => (
                  <option
                    className="dark:text-black"
                    key={estatus.id_Estatus}
                    value={estatus.id_Estatus}
                  >
                    {estatus.de_Estatus}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </div>

          <div>
            <Label className="text-[1.6rem]">Fecha Pedido</Label>
            <Datepicker
              disabled={sn_Visualizar}
              key={formPedidos.fh_Pedido}
              color={`${fechaPedidoValida ? '' : 'failure'}`}
              ref={fh_PedidoRef}
              placeholder="Fecha Pedido"
              id="fh_Pedido"
              name="fh_Pedido"
              value={getDateForPicker(formPedidos.fh_Pedido)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_Pedido');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${fechaPedidoValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={true}
              onBlur={() => setFechaPedidoValida(true)}
            />
          </div>

          <div>
            <Label className="text-[1.6rem]">Fecha Envío Producción</Label>
            <Datepicker
              disabled={sn_Visualizar}
              key={formPedidos.fh_EnvioProduccion || 'fh_EnvioProduccion'} // Cambia la clave cuando el valor cambia
              color={`${fechaEnvioValida ? '' : 'failure'}`}
              ref={fh_EnvioProduccionRef}
              placeholder="Fecha Envío Producción"
              id="fh_EnvioProduccion"
              name="fh_EnvioProduccion"
              value={getDateForPicker(formPedidos.fh_EnvioProduccion)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_EnvioProduccion');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${fechaEnvioValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
              onBlur={() => setFechaEnvioValida(true)}
            />
          </div>

          <div>
            <Label className="text-[1.6rem]">Fecha Entrega Estimada</Label>
            <Datepicker
              disabled={sn_Visualizar}
              key={formPedidos.fh_EntregaEstimada || 'fh_EntregaEstimada'} // Cambia la clave cuando el valor cambia
              color={`${fechaEntregaValida ? '' : 'failure'}`}
              ref={fh_EntregaEstimadaRef}
              placeholder="Fecha Entrega Estimada"
              id="fh_EntregaEstimada"
              name="fh_EntregaEstimada"
              value={getDateForPicker(formPedidos.fh_EntregaEstimada)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_EntregaEstimada');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${fechaEntregaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
              onBlur={() => setFechaEntregaValida(true)}
            />
          </div>
        </div>
      </div>

      {/* Vías de Contacto */}
      <div>
        <div className="mt-[2rem] grid sm:grid-cols-3 gap-x-[2.5rem] gap-y-[1.2rem]">
          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Vía de Contacto</Label>
            <Select
              disabled={sn_Visualizar}
              ref={id_ViaContactoRef}
              value={formPedidos.id_ViaContacto || ''}
              color={`${viaContactoValida ? '' : 'failure'}`}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${modeloValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="id_Cliente"
              name="id_Cliente"
              onChange={(e) => {
                const selectedVia = e.target.value;
                setFormPedidos({
                  ...formPedidos,
                  id_ViaContacto: Number(selectedVia),
                });
              }}
              onBlur={() => setViaContactoValida(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option
                className="dark:text-black"
                value={0}
                disabled={!!formPedidos.id_ViaContacto}
              >
                Seleccione una opción
              </option>

              {viasContacto && viasContacto.length > 0 ? (
                viasContacto.map((viaContacto) => (
                  <option
                    className="dark:text-black"
                    key={viaContacto.id_ViaContacto}
                    value={viaContacto.id_ViaContacto}
                  >
                    {viaContacto.de_ViaContacto}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </div>

          {/* Campo adicional si selecciona Online u Otros */}
          {(formPedidos.id_ViaContacto === 1 ||
            formPedidos.id_ViaContacto === 6) && (
            <div className="dark:text-white">
              <Label className="text-[1.6rem] font-bold">Especifique</Label>
              <TextInput
                disabled={sn_Visualizar}
                ref={de_ViaContactoRef}
                type="text"
                placeholder={
                  formPedidos.id_ViaContacto === 1
                    ? 'Especifique la plataforma online'
                    : 'Especifique otra vía de contacto'
                }
                id="de_ViaContacto"
                name="de_ViaContacto"
                color={`${DescripcionContactoValida ? '' : 'failure'}`}
                className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${conceptoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                value={formPedidos.de_ViaContacto || ''}
                onChange={(e) =>
                  setFormPedidos({
                    ...formPedidos,
                    de_ViaContacto: e.target.value,
                  })
                }
                style={{
                  fontSize: '1.4rem',
                  border: '1px solid #b9b9b9',
                  backgroundColor: '#ffffff',
                }}
                onBlur={() => setDescripcionContactoValida(true)}
                sizing="lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Datos de DetallesPedido */}
      <div>
        <p className="mt-[3rem] text-[1.8rem] font-semibold">
          Datos Especificos del Pedido
        </p>
        <div className="mt-[2rem] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2.5rem] gap-y-[1rem]">
          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Concepto</Label>
            <TextInput
              disabled={sn_Visualizar}
              ref={de_ConceptoRef}
              type="text"
              placeholder="Concepto"
              id="de_Concepto"
              name="de_Concepto"
              color={`${conceptoValido ? '' : 'failure'}`}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${conceptoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              value={formPedidos.de_Concepto}
              onChange={(e) =>
                setFormPedidos({
                  ...formPedidos,
                  de_Concepto: e.target.value,
                })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
              onBlur={() => setConceptoValido(true)}
              sizing="lg"
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Genero
            </Label>
            <Select
              disabled={sn_Visualizar}
              ref={de_GeneroRef}
              value={formPedidos.de_Genero}
              color={`${generoValido ? '' : 'failure'}`}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${generoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="de_Genero"
              name="de_Genero"
              onChange={(e) => obtenerPrecioUnitario(e.target)}
              onBlur={() => setGeneroValido(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option
                className="dark:text-black"
                value=""
                disabled={!!formPedidos.de_Genero}
              >
                Seleccione el Genero
              </option>
              <option className="dark:text-black" value="H">
                Hombre
              </option>
              <option className="dark:text-black" value="M">
                Mujer
              </option>
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Modelo
            </Label>
            <Select
              disabled={sn_Visualizar}
              ref={id_ModeloRef}
              value={formPedidos.id_Modelo}
              color={`${modeloValido ? '' : 'failure'}`}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${modeloValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="id_Modelo"
              name="id_Modelo"
              onChange={(e) => {
                setFormPedidos({
                  ...formPedidos,
                  id_Modelo: e.target.value,
                });
              }}
              onBlur={() => setModeloValido(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Seleccione un Modelo
              </option>
              {modelos && modelos.length > 0 ? (
                modelos.map((modelo) => (
                  <option
                    className="dark:text-black"
                    key={modelo.id_Modelo}
                    value={modelo.id_Modelo}
                  >
                    {modelo.de_Modelo}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Tipo Prenda
            </Label>
            <Select
              disabled={sn_Visualizar}
              ref={id_TipoPrendaRef}
              value={formPedidos.id_TipoPrenda}
              color={`${tipoPrendaValida ? '' : 'failure'}`}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tipoPrendaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="id_TipoPrenda"
              name="id_TipoPrenda"
              onChange={(e) => obtenerPrecioUnitario(e.target)}
              onBlur={() => setTipoPrendaValida(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Seleccione un Tipo de Prenda
              </option>
              {tipoPrendas && tipoPrendas.length > 0 ? (
                tipoPrendas.map((tipoPrenda) => (
                  <option
                    className="dark:text-black"
                    key={tipoPrenda.id_TipoPrenda}
                    value={tipoPrenda.id_TipoPrenda}
                  >
                    {tipoPrenda.de_TipoPrenda}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Talla
            </Label>
            <Select
              disabled={sn_Visualizar}
              ref={id_TallaRef}
              value={formPedidos.id_Talla}
              color={`${tallaValida ? '' : 'failure'}`}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tallaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="id_Talla"
              name="id_Talla"
              onChange={(e) => obtenerPrecioUnitario(e.target)}
              onBlur={() => setTallaValida(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Seleccione una Talla
              </option>
              {tallas.map((talla) => (
                <option
                  className="dark:text-black"
                  key={talla.id_Talla}
                  value={talla.id_Talla}
                >
                  {talla.de_Talla}
                </option>
              ))}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Color
            </Label>
            <Select
              disabled={sn_Visualizar}
              ref={id_ColorRef}
              value={formPedidos.id_Color}
              color={`${colorValido ? '' : 'failure'}`}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${colorValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="id_Color"
              name="id_Color"
              onChange={(e) => {
                setFormPedidos({
                  ...formPedidos,
                  id_Color: e.target.value,
                });
                // calcularPrecioUnitario();
              }}
              onBlur={() => setColorValido(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Seleccione un Color
              </option>
              {colores && colores.length > 0 ? (
                colores.map((color) => (
                  <option
                    className="dark:text-black"
                    key={color.id_Color}
                    value={color.id_Color}
                  >
                    {color.de_ColorTela}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Tipo Tela
            </Label>
            <Select
              disabled={sn_Visualizar}
              ref={id_TipoTelaRef}
              value={formPedidos.id_TipoTela}
              color={`${tipoTelaValida ? '' : 'failure'}`}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tipoTelaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="id_TipoTela"
              name="id_TipoTela"
              onChange={(e) => {
                setFormPedidos({
                  ...formPedidos,
                  id_TipoTela: e.target.value,
                });
              }}
              onBlur={() => setTipoTelaValida(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Seleccione un Tipo de Tela
              </option>
              {tipoTelas.map((tipoTela) => (
                <option
                  className="dark:text-black"
                  key={tipoTela.id_TipoTela}
                  value={tipoTela.id_TipoTela}
                >
                  {tipoTela.de_TipoTela}
                </option>
              ))}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Cantidad</Label>
            <TextInput
              disabled={sn_Visualizar}
              ref={nu_CantidadRef}
              color={`${cantidadValida ? '' : 'failure'}`}
              type="number"
              placeholder="Cantidad"
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${cantidadValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              value={formPedidos.nu_Cantidad}
              id="nu_Cantidad"
              name="nu_Cantidad"
              onChange={(e) => {
                setFormPedidos({
                  ...formPedidos,
                  nu_Cantidad: Number(e.target.value),
                });
              }}
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
              onBlur={() => setCantidadValida(true)}
              sizing="lg"
              min="1"
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Precio Unitario</Label>
            <TextInput
              disabled={sn_Visualizar}
              ref={im_PrecioUnitarioRef}
              color={`${precioValido ? '' : 'failure'}`}
              readOnly
              type="number"
              placeholder="Precio Unitario"
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${precioValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              value={formPedidos.im_PrecioUnitario}
              id="im_PrecioUnitario"
              name="im_PrecioUnitario"
              addon="$"
              required
              onChange={(e) =>
                setFormPedidos({
                  ...formPedidos,
                  im_PrecioUnitario: Number(e.target.value),
                })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#F5F5F5',
              }}
              onBlur={() => setPrecioValido(true)}
              sizing="lg"
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">SubTotal</Label>
            <TextInput
              disabled={sn_Visualizar}
              color={`${subtotalValido ? '' : 'failure'}`}
              ref={im_SubTotalRef}
              readOnly
              type="number"
              addon="$"
              placeholder="SubTotal"
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${subtotalValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              value={formPedidos.im_SubTotal}
              id="im_SubTotal"
              name="im_SubTotal"
              onChange={(e) =>
                setFormPedidos({
                  ...formPedidos,
                  im_SubTotal: Number(e.target.value),
                })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#F5F5F5',
              }}
              onBlur={() => setSubtotalValido(true)}
              sizing="lg"
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Impuesto</Label>
            <Select
              disabled={sn_Visualizar}
              color={`${impuestoValido ? '' : 'failure'}`}
              ref={im_ImpuestoRef}
              value={formPedidos.im_Impuesto}
              onChange={(e) => {
                setFormPedidos({
                  ...formPedidos,
                  im_Impuesto: Number(e.target.value),
                });
              }}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${impuestoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="im_Impuesto"
              name="im_Impuesto"
              onBlur={() => setImpuestoValido(true)}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="" disabled={!!formPedidos.im_Impuesto}>
                Seleccione un Impuesto
              </option>
              {[
                { id: 0.16, texto: 'IVA - 16%' },
                { id: 0.3, texto: 'ISR - 30%' },
                { id: 0.012612, texto: 'IEPS - 1.2612%' },
                { id: 0.15, texto: 'Arancel - 15%' },
              ].map((impuesto) => (
                <option key={impuesto.id} value={impuesto.id}>
                  {impuesto.texto}
                </option>
              ))}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Total</Label>
            <TextInput
              disabled={sn_Visualizar}
              color={`${totalValido ? '' : 'failure'}`}
              ref={im_TotalRef}
              readOnly
              type="number"
              addon="$"
              placeholder="Total"
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${totalValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              value={formPedidos.im_Total}
              id="im_Total"
              name="im_Total"
              onChange={(e) =>
                setFormPedidos({
                  ...formPedidos,
                  im_Total: Number(e.target.value),
                })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#F5F5F5',
              }}
              onBlur={() => setTotalValido(true)}
              sizing="lg"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t-[0.3rem] mt-[3rem] border-[#d1cece]">
        <Button
          hidden={sn_Visualizar || sn_Editar}
          colorScheme="pink"
          // onClick={addRedSocial}
          // disabled={sn_Visualizar}
          mt={4}
          style={{
            fontSize: '1.8rem',
            padding: '1.6rem',
          }}
          onClick={() => validarDatosFormulario(false)}
        >
          Guardar y agregar otro Pedido
        </Button>
        <Button
          hidden={sn_Visualizar}
          colorScheme="blue"
          // onClick={addRedSocial}
          // disabled={sn_Visualizar}
          mt={4}
          style={{
            fontSize: '1.8rem',
            padding: '1.6rem',
          }}
          onClick={() => validarDatosFormulario(true)}
        >
          Guardar
        </Button>

        <Button
          colorScheme="orange"
          // onClick={addRedSocial}
          // disabled={sn_Visualizar}
          mt={4}
          style={{
            fontSize: '1.8rem',
            padding: '1.6rem',
          }}
          onClick={() => {
            setSn_Agregar(false);
            setSn_Editar(false);
            setSn_Visualizar(false);
          }}
        >
          Regresar
        </Button>
      </div>

      <ModalConfirmacionAgregar
        isOpen={isModalOpen}
        onClose={cerrarModalConfirmacion}
        onConfirm={guardarPedido}
        objeto="Pedido"
      />
    </div>
  );
};
