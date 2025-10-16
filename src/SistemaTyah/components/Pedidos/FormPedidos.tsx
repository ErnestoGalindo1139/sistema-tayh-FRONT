/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
  IFormPedidos,
  IViaContactoCombo,
  IPedidos,
  IFiltrosPedidos,
  IPedidosDetalles,
  IFormPedidosDetalle,
} from '../../interfaces/interfacesPedidos';
import {
  Datepicker,
  Label,
  Select,
  TextInput,
  DatepickerRef,
  Tooltip,
} from 'flowbite-react';
import { customDatePickerTheme } from '../../themes/customDatePickerTheme';
import { IApiError } from '../../interfaces/interfacesApi';
import Toast from '../Toast';
import {
  createPedidos,
  getIdPedido,
  getPedidos,
  getPedidosDetalle,
  getViasContactoClientes,
  getViasContactoCombo,
  updatePedidos,
} from '../../helpers/apiPedidos';
import { Button, useDisclosure } from '@chakra-ui/react';
import { ModalConfirmacionAgregar } from '../../dialogs/ModalConfirmacionAgregar';
import { getClientesCombo } from '../../helpers/apiClientes';
import { IClientesCombo } from '../../interfaces/interfacesClientes';
import { WaitScreen } from '../WaitScreen';
import { IEstatus } from '../../interfaces/interfacesEstatus';
import { useValidations } from '../../hooks/useValidations';
import { useFormDate } from '../../hooks/useFormDate';
import { useForm } from '../../hooks/useForm';
import { DataTable } from '../DataTable';
import { EyeIcon } from '../../icons/EyeIcon';
import { EditIcon } from '../../icons/EditIcon';
import { AddIcon } from '../../icons/AddIcon';
import { ModalPedidosDetalleAgregar } from '../../dialogs/ModalPedidosDetalleAgregar';
import { FaTrash } from 'react-icons/fa';
import { getFechaActual } from '../../utils/fechas';

interface IFormPedidosProps {
  setSn_Agregar: React.Dispatch<React.SetStateAction<boolean>>;
  setSn_Editar: React.Dispatch<React.SetStateAction<boolean>>;
  setSn_Visualizar: React.Dispatch<React.SetStateAction<boolean>>;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
  sn_Agregar: boolean;
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
  sn_Agregar,
  row,
  actualizarPedidos,
  filtros,
  estatusPedidos,
}: IFormPedidosProps): React.JSX.Element => {
  const {
    formState: formPedidos,
    setFormState: setFormPedidos,
    onInputChange,
    // onResetForm: limpiarFormulario,
  } = useForm<IFormPedidos>({
    ...row,
    fh_Pedido: row.fh_Pedido ? row.fh_Pedido : getFechaActual(),
    fh_EnvioProduccion: row.fh_EnvioProduccion
      ? row.fh_EnvioProduccion
      : getFechaActual(),
    fh_EntregaEstimada: row.fh_EntregaEstimada
      ? row.fh_EntregaEstimada
      : getFechaActual(),
  });

  // const {
  //   formState: formPedidosDetalle,
  //   setFormState: setFormPedidosDetalle,
  //   onInputChange: onInputChangeDetalle,
  //   // onResetForm: limpiarFormulario,
  // } = useForm<IFormPedidosDetalle>({
  //   id_Detalle: 0,
  //   id_Modelo: '',
  //   id_Talla: '',
  //   id_Color: '',
  //   id_TipoTela: '',
  //   id_TipoPrenda: '',
  //   de_Concepto: '',
  //   nu_Cantidad: 0,
  //   im_PrecioUnitario: 0,
  //   im_SubTotal: 0,
  //   im_Impuesto: 0,
  //   im_Total: 0,
  //   de_Genero: '',
  //   id_Pedido: 0,
  //   de_GeneroCompleto: '',
  //   de_Modelo: '',
  //   de_Talla: '',
  //   de_Color: '',
  //   de_TipoTela: '',
  //   de_TipoPrenda: '',
  // });

  const [pedidosDetalles, setPedidosDetalles] = useState<IPedidosDetalles[]>(
    []
  );

  const [pedidosDetalle, setPedidosDetalle] = useState<IFormPedidosDetalle>();

  const [clientes, setClientes] = useState<IClientesCombo[]>([]);
  const [viasContacto, setViasContacto] = useState<IViaContactoCombo[]>([]);

  // Referencias al Pedido en General
  const fh_PedidoRef = useRef<DatepickerRef>(null);
  const fh_EnvioProduccionRef = useRef<DatepickerRef>(null);
  const fh_EntregaEstimadaRef = useRef<DatepickerRef>(null);
  const id_ClienteRef = useRef<HTMLSelectElement>(null);
  const id_EstatusRef = useRef<HTMLSelectElement>(null);
  const id_ViaContactoRef = useRef<HTMLSelectElement>(null);
  const de_ViaContactoRef = useRef<HTMLInputElement>(null);
  // const im_ImpuestoRef = useRef<HTMLSelectElement>(null);
  const im_IVARef = useRef<HTMLSelectElement>(null);
  const im_ISRRef = useRef<HTMLSelectElement>(null);
  const im_TotalRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Hook para manejar todas las validaciones generales
  const { validarCampo, validarRangoFechas } = useValidations();

  // Hook Para manejar el cambio de Fechas
  const { handleDateChange, getDateForPicker } = useFormDate(
    formPedidos,
    setFormPedidos
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cerrarFormulario, setCerrarFormulario] = useState(false);

  const [sn_VisualizarDetalle, setSn_VisualizarDetalle] =
    useState<boolean>(false);
  const [sn_EditarDetalle, setSn_EditarDetalle] = useState<boolean>(false);
  // const [sn_AgregarDetalle, setSn_AgregarDetalle] = useState<boolean>(false);

  const {
    isOpen: isModalDetalleOpen,
    onOpen: openDetalleModal,
    onClose: closeDetalleModal,
  } = useDisclosure();

  const [tieneViasContacto, setTieneViasContacto] = useState(false);

  // Estados relacionados con Pedido en General
  const [fechaPedidoValida, setFechaPedidoValida] = useState(true);
  const [fechaEnvioValida, setFechaEnvioValida] = useState(true);
  const [fechaEntregaValida, setFechaEntregaValida] = useState(true);
  const [clienteValido, setClienteValido] = useState(true);
  const [estatusValido, setEstatusValido] = useState(true);
  const [viaContactoValida, setViaContactoValida] = useState(true);
  const [DescripcionContactoValida, setDescripcionContactoValida] =
    useState(true);
  // const [impuestoValido, setImpuestoValido] = useState(true);
  const [ivaValido, setIvaValido] = useState(true);
  const [isrValido, setIsrValido] = useState(true);
  const [totalValido, setTotalValido] = useState(true);

  useEffect(() => {
    const fetchPedidos = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const pedidosDetalleData = await getPedidosDetalle(formPedidos);
        setPedidosDetalles(pedidosDetalleData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    // Calcular el SubTotal de todos los detalles
    const total = pedidosDetalles.reduce((acc, item) => {
      return acc + item.im_SubTotal;
    }, 0);

    setFormPedidos({
      ...formPedidos,
      im_SubTotal: total,
    });
  }, [pedidosDetalles]);

  useEffect(() => {
    const im_EnvioDomicilio = formPedidos.sn_EnvioDomicilio == 1 ? 98 : 0;
    setFormPedidos({
      ...formPedidos,
      im_EnvioDomicilio,
    });
  }, [formPedidos.sn_EnvioDomicilio]);

  useEffect(() => {
    const { im_SubTotal = 0, im_IVA = 0, im_ISR = 0 } = formPedidos;

    const totalIVA = parseFloat((im_SubTotal * im_IVA).toFixed(2));
    const totalISR = parseFloat((im_SubTotal * im_ISR).toFixed(2));

    setFormPedidos((prev) => ({
      ...prev,
      im_TotalIVA: totalIVA,
      im_TotalISR: totalISR,
    }));
  }, [formPedidos.im_SubTotal, formPedidos.im_IVA, formPedidos.im_ISR]);

  useEffect(() => {
    const {
      im_SubTotal = 0,
      im_TotalIVA = 0,
      im_TotalISR = 0,
      im_EnvioDomicilio = 0,
    } = formPedidos;

    const im_TotalPedido = parseFloat(
      (im_SubTotal + im_TotalIVA - im_TotalISR + im_EnvioDomicilio).toFixed(2)
    );

    setFormPedidos({
      ...formPedidos,
      im_TotalPedido,
    });
  }, [
    formPedidos.im_SubTotal,
    formPedidos.im_TotalIVA,
    formPedidos.im_TotalISR,
    formPedidos.im_EnvioDomicilio,
  ]);

  const columns: {
    id: keyof IPedidosDetalles;
    texto: string;
    visible: boolean;
    width: string;
    bgColor?: string;
    textAlign?: string;
  }[] = [
    { id: 'id_Detalle', texto: 'Folio Detalle', visible: true, width: '5%' },
    { id: 'id_Modelo', texto: 'ID Modelo', visible: false, width: '5%' },
    { id: 'id_Talla', texto: 'Talla', visible: false, width: '5%' },
    { id: 'id_Color', texto: 'Color', visible: false, width: '5%' },
    { id: 'id_TipoTela', texto: 'Tipo Tela', visible: false, width: '5%' },
    { id: 'id_TipoPrenda', texto: 'Tipo Prenda', visible: false, width: '5%' },
    { id: 'de_Genero', texto: 'Genero', visible: false, width: '5%' },
    { id: 'de_GeneroCompleto', texto: 'Genero', visible: true, width: '10%' },
    { id: 'de_Modelo', texto: 'Modelo', visible: true, width: '10%' },
    { id: 'de_TipoPrenda', texto: 'Tipo Prenda', visible: true, width: '10%' },
    { id: 'de_Talla', texto: 'Talla', visible: true, width: '5%' },
    { id: 'de_Color', texto: 'Color', visible: true, width: '10%' },
    { id: 'de_TipoTela', texto: 'Tipo Tela', visible: true, width: '10%' },
    { id: 'nu_Cantidad', texto: 'Cantidad', visible: true, width: '10%' },
    { id: 'im_PrecioUnitario', texto: 'Precio', visible: true, width: '10%' },
    { id: 'pj_Descuento', texto: 'Descuento', visible: true, width: '10%' },
    { id: 'im_SubTotal', texto: 'SubTotal', visible: true, width: '10%' },
  ];

  const actions = [
    {
      icono: <EyeIcon className="text-blue-500" />,
      texto: 'Visualizar',
      onClick: (row: IPedidosDetalles): void => {
        setSn_VisualizarDetalle(true);
        setSn_EditarDetalle(false);
        // setSn_AgregarDetalle(false);
        limpiarPedidoDetalle();
        openDetalleModal();
        setPedidosDetalle({
          ...row,
        });
      },
      width: '5%',
    },
    {
      icono: <EditIcon className="text-[#a22694]" />,
      texto: 'Editar',
      onClick: (row: IPedidosDetalles): void => {
        setSn_EditarDetalle(true);
        setSn_VisualizarDetalle(false);
        // setSn_AgregarDetalle(false);
        limpiarPedidoDetalle();
        openDetalleModal();
        setPedidosDetalle({
          ...row,
        });
      },
    },
    {
      icono: <FaTrash className="text-[#ff0000]" />,
      texto: 'Eliminar',
      onClick: (row: IPedidosDetalles): void => {
        setSn_EditarDetalle(false);
        setSn_VisualizarDetalle(false);
        // setSn_AgregarDetalle(false);
        eliminarPedidoDetalle(row.id_Detalle);
      },
    },
  ];

  const filteredActions = sn_Visualizar
    ? actions.filter((action) => action.texto === 'Visualizar')
    : actions;

  const eliminarPedidoDetalle = (id_Detalle: number): void => {
    setPedidosDetalles((prevDetalles) => {
      // Filtra el elemento eliminado
      const nuevosDetalles = prevDetalles.filter(
        (item) => item.id_Detalle !== id_Detalle
      );

      // Reasigna los IDs de manera consecutiva
      const detallesReasignados = nuevosDetalles.map((item, index) => ({
        ...item,
        id_Detalle: index + 1, // Los IDs comienzan desde 1
      }));

      return detallesReasignados;
    });
  };

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
    if (!tieneViasContacto) {
      setFormPedidos({
        ...formPedidos,
        de_ViaContacto: '',
      });
    }
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
    const fetchViasContactoClientes = async (): Promise<void> => {
      try {
        const viasContactoClientesData =
          await getViasContactoClientes(formPedidos); // Modulo de Pedidos

        if (viasContactoClientesData.body[0]?.id_ViaContacto) {
          setTieneViasContacto(true);
        } else {
          setTieneViasContacto(false);
        }

        setFormPedidos({
          ...formPedidos,
          id_ViaContacto: viasContactoClientesData.body[0]?.id_ViaContacto || 0,
          de_ViaContacto:
            viasContactoClientesData.body[0]?.de_ViaContacto || '',
        });
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

    fetchViasContactoClientes();
  }, [formPedidos.id_Cliente]);

  useEffect(() => {
    const fetchIdPedido = async (): Promise<void> => {
      try {
        if (sn_Agregar) {
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

  const limpiarPedidoDetalle = (): void => {
    setPedidosDetalle({
      id_Detalle: 0,
      id_Modelo: '',
      id_Talla: '',
      id_Color: '',
      id_TipoTela: '',
      id_TipoPrenda: '',
      de_Concepto: '',
      nu_Cantidad: 0,
      im_PrecioUnitario: 0,
      im_SubTotal: 0,
      pj_Descuento: 0,
      im_Impuesto: 0,
      im_Total: 0,
      de_Genero: '',
      id_Pedido: 0,
      de_GeneroCompleto: '',
      de_Modelo: '',
      de_Talla: '',
      de_Color: '',
      de_TipoTela: '',
      de_TipoPrenda: '',
    });
  };

  // const obtenerPrecioUnitario = async (
  //   target: HTMLSelectElement
  // ): Promise<void> => {
  //   const { name, value } = target;

  //   // Actualizamos el campo correspondiente en el estado
  //   setFormPedidos((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   // Llamamos a la función para obtener el nuevo precio unitario
  //   const calculo = await calcularPrecioUnitarioHelper({
  //     ...formPedidos,
  //     [name]: value,
  //   });

  //   // Actualizamos el estado con el nuevo precio unitario
  //   setFormPedidos((prev) => ({
  //     ...prev,
  //     im_PrecioUnitario: calculo.body,
  //   }));
  // };

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
      // !validarCampo(
      //   formPedidos.im_Impuesto,
      //   im_ImpuestoRef,
      //   setImpuestoValido,
      //   'Impuesto'
      // ) ||
      !validarCampo(formPedidos.im_IVA, im_IVARef, setIvaValido, 'IVA') ||
      !validarCampo(formPedidos.im_ISR, im_ISRRef, setIsrValido, 'ISR')
      // !validarCampo(formPedidos.im_Total, im_TotalRef, setTotalValido, 'Total')
    ) {
      return;
    }

    // Validaciones más especificas
    if (!pedidosDetalles.length) {
      Toast.fire({
        icon: 'warning',
        title: 'Detalles Vacíos',
        text: 'Por favor, Ingrese por lo menos un Detalle...',
      });
      return;
    }

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

    // // No se puede agragar Cantidad Negativa
    // if (
    //   !validarNumeroNegativo(
    //     formPedidos.nu_Cantidad,
    //     nu_CantidadRef,
    //     setCantidadValida,
    //     'Cantidad'
    //   )
    // ) {
    //   return;
    // }

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
        pedidosDetalles,
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
    if (cerrarFormulario) {
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
        im_Impuesto: 0,
        im_IVA: 0,
        im_ISR: 0,
        im_TotalImpuesto: 0,
        im_TotalIVA: 0,
        im_TotalISR: 0,
        im_TotalPedido: 0,
        im_SubTotal: 0,
        pedidosDetalles: [],
      });
    } else {
      setFormPedidos({
        ...formPedidos,
        fh_EnvioProduccion: '',
        fh_EntregaEstimada: '',
        // de_Concepto: '',
      });
    }
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
              onChange={onInputChange}
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
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${clienteValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="id_Cliente"
              name="id_Cliente"
              onChange={onInputChange}
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
              disabled={sn_Editar ? false : true}
              ref={id_EstatusRef}
              color={`${estatusValido ? '' : 'failure'}`}
              value={formPedidos.id_Estatus}
              onChange={onInputChange}
              id="id_Estatus"
              name="id_Estatus"
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
              key={formPedidos.fh_Pedido || 'fh_Pedido'} // Cambia la clave cuando el valor cambia
              color={`${fechaPedidoValida ? '' : 'failure'}`}
              ref={fh_PedidoRef}
              placeholder="Fecha Pedido"
              id="fh_Pedido"
              name="fh_Pedido"
              value={getDateForPicker(formPedidos.fh_Pedido)}
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
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${viaContactoValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              id="id_ViaContacto"
              name="id_ViaContacto"
              onChange={onInputChange}
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
          {(formPedidos.id_ViaContacto == 1 ||
            formPedidos.id_ViaContacto == 6) && (
            <div className="dark:text-white">
              <Label className="text-[1.6rem] font-bold">Especifique</Label>
              <TextInput
                disabled={sn_Visualizar}
                ref={de_ViaContactoRef}
                type="text"
                placeholder={
                  formPedidos.id_ViaContacto == 1
                    ? 'Especifique la plataforma online'
                    : 'Especifique otra vía de contacto'
                }
                id="de_ViaContacto"
                name="de_ViaContacto"
                color={`${DescripcionContactoValida ? '' : 'failure'}`}
                className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${DescripcionContactoValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                value={formPedidos.de_ViaContacto || ''}
                onChange={onInputChange}
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

      <br />
      <br />
      <br />

      <div className="flex items-center justify-between">
        <div className="dark:text-white">
          <h2 className="font-bold text-[2.5rem]">Detalles del Pedido</h2>
        </div>

        <Tooltip
          content="Agregar Detalle"
          className="text-[1.3rem]"
          placement="bottom"
        >
          <button
            hidden={sn_Visualizar}
            onClick={() => {
              // setSn_AgregarDetalle(false);
              setSn_EditarDetalle(false);
              setSn_VisualizarDetalle(false);
              limpiarPedidoDetalle();
              openDetalleModal();
            }}
          >
            <AddIcon width="4em" height="4em" />
          </button>
        </Tooltip>
      </div>

      {/* Segunda tabla para los detalles */}
      <div className="table-container dark:bg-transparent">
        <DataTable
          data={pedidosDetalles}
          columns={columns}
          actions={filteredActions}
          initialRowsPerPage={10}
        />
      </div>

      <br />

      {/* Datos de DetallesPedido */}
      {/* <div>
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
              onChange={onInputChange}
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
              onChange={(e) => obtenerPrecioUnitario(e.target)}
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
              <option
                className="dark:text-black"
                value=""
                disabled={!!formPedidos.id_Talla}
              >
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
              onChange={onInputChange}
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
              onChange={onInputChange}
              onBlur={() => setTipoTelaValida(true)}
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
                disabled={!!formPedidos.id_TipoTela}
              >
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
              onChange={onInputChange}
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
              onBlur={() => setCantidadValida(true)}
              onFocus={() => seleccionarTextoInput(nu_CantidadRef)}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
      </div> */}

      <div className="w-full">
        <div className="dark:text-white mt-[2rem] flex flex-col">
          {/* SubTotal */}
          <div className="grid grid-cols-1 sm:grid-cols-5 sm:gap-6 gap-2 items-center">
            <Label className="sm:text-[2rem] text-[1.6rem] font-bold col-span-3 sm:text-right text-left">
              SubTotal
            </Label>
            <TextInput
              disabled={sn_Visualizar}
              readOnly
              type="number"
              addon="$"
              className="dark:text-white mb-2 col-span-2 rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black"
              id="im_SubTotal"
              name="im_SubTotal"
              value={formPedidos.im_SubTotal}
              onChange={onInputChange}
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#F5F5F5',
              }}
              sizing="lg"
            />
          </div>

          {/* Impuesto */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-5 sm:gap-6 gap-2 items-center">
            <Label className="sm:text-[2rem] text-[1.6rem] font-bold col-span-3 sm:text-right text-left">
              Impuesto
            </Label>
            <div className="col-span-2 flex gap-6">
              <Select
                color={`${impuestoValido ? '' : 'failure'}`}
                ref={im_ImpuestoRef}
                disabled={sn_Visualizar}
                value={formPedidos.im_Impuesto}
                onChange={onInputChange}
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
              <TextInput
                disabled={sn_Visualizar}
                readOnly
                type="number"
                addon="$"
                className="dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black"
                id="im_TotalImpuesto"
                name="im_TotalImpuesto"
                value={formPedidos.im_TotalImpuesto}
                onChange={onInputChange}
                style={{
                  fontSize: '1.4rem',
                  border: '1px solid #b9b9b9',
                  backgroundColor: '#F5F5F5',
                }}
                sizing="lg"
              />
            </div>
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-5 sm:gap-6 gap-2 items-center">
            <Label className="sm:text-[2rem] text-[1.6rem] font-bold col-span-3 sm:text-right text-left">
              IVA:
            </Label>
            <div className="col-span-2 flex gap-6">
              <Select
                color={`${ivaValido ? '' : 'failure'}`}
                ref={im_IVARef}
                disabled={sn_Visualizar}
                value={formPedidos.im_IVA}
                onChange={onInputChange}
                // onChange={(e) => {
                //   const porcentaje = parseFloat(e.target.value);
                //   setFormPedidos((prev) => ({
                //     ...prev,
                //     ivaPorcentaje: porcentaje,
                //     // im_IVA: calcularPorcentaje(prev.im_Subtotal, porcentaje),
                //   }));
                // }}
                className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${ivaValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                id="im_IVA"
                name="im_IVA"
                onBlur={() => setIvaValido(true)}
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
                  { id: 0.0, texto: '0%' },
                  { id: 0.08, texto: '8%' },
                  { id: 0.16, texto: '16%' },
                ].map((impuesto) => (
                  <option key={impuesto.id} value={impuesto.id}>
                    {impuesto.texto}
                  </option>
                ))}
              </Select>
              <TextInput
                disabled={sn_Visualizar}
                readOnly
                type="number"
                addon="$"
                className="dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black"
                id="im_TotalIVA"
                name="im_TotalIVA"
                value={formPedidos.im_TotalIVA}
                onChange={onInputChange}
                style={{
                  fontSize: '1.4rem',
                  border: '1px solid #b9b9b9',
                  backgroundColor: '#F5F5F5',
                }}
                sizing="lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 sm:gap-6 gap-2 items-center">
            <Label className="sm:text-[2rem] text-[1.6rem] font-bold col-span-3 sm:text-right text-left">
              RETISR:
            </Label>
            <div className="col-span-2 flex gap-6">
              <Select
                color={`${isrValido ? '' : 'failure'}`}
                ref={im_ISRRef}
                disabled={sn_Visualizar}
                value={formPedidos.im_ISR}
                onChange={onInputChange}
                className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${isrValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                id="im_ISR"
                name="im_ISR"
                onBlur={() => setIsrValido(true)}
                sizing="lg"
                style={{
                  fontSize: '1.4rem',
                  border: '1px solid #b9b9b9',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="" disabled={!!formPedidos.im_ISR}>
                  Seleccione un Impuesto
                </option>
                {[
                  { id: 0.0, texto: '0%' },
                  { id: 0.0125, texto: '1.25%' },
                  { id: 0.1, texto: '10%' },
                ].map((impuesto) => (
                  <option key={impuesto.id} value={impuesto.id}>
                    {impuesto.texto}
                  </option>
                ))}
              </Select>
              <TextInput
                disabled={sn_Visualizar}
                readOnly
                type="number"
                addon="$"
                className="dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black"
                id="im_TotalISR"
                name="im_TotalISR"
                value={formPedidos.im_TotalISR}
                onChange={onInputChange}
                style={{
                  fontSize: '1.4rem',
                  border: '1px solid #b9b9b9',
                  backgroundColor: '#F5F5F5',
                }}
                sizing="lg"
              />
            </div>
          </div>

          {/* Envío */}
          <div className="grid grid-cols-1 sm:grid-cols-5 sm:gap-6 gap-2 items-center">
            <Label className="sm:text-[2rem] text-[1.6rem] font-bold col-span-3 sm:text-right text-left">
              Envío a Domicilio
            </Label>
            <div className="col-span-2 flex gap-6">
              <Select
                disabled={sn_Visualizar}
                value={formPedidos.sn_EnvioDomicilio}
                className="dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black"
                id="sn_EnvioDomicilio"
                name="sn_EnvioDomicilio"
                onChange={onInputChange}
                sizing="lg"
                style={{
                  fontSize: '1.4rem',
                  border: '1px solid #b9b9b9',
                  backgroundColor: '#ffffff',
                }}
              >
                <option className="dark:text-black" value="0">
                  No
                </option>
                <option className="dark:text-black" value="1">
                  Si
                </option>
              </Select>
              <TextInput
                disabled={sn_Visualizar}
                readOnly
                type="number"
                addon="$"
                className="dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black"
                id="im_EnvioDomicilio"
                name="im_EnvioDomicilio"
                value={formPedidos.im_EnvioDomicilio}
                onChange={onInputChange}
                style={{
                  fontSize: '1.4rem',
                  border: '1px solid #b9b9b9',
                  backgroundColor: '#F5F5F5',
                }}
                sizing="lg"
              />
            </div>
          </div>

          {/* Total */}
          <div className="grid grid-cols-1 sm:grid-cols-5 sm:gap-6 gap-2 items-center">
            <Label className="sm:text-[2rem] text-[1.6rem] font-bold col-span-3 sm:text-right text-left">
              Total
            </Label>
            <TextInput
              disabled={sn_Visualizar}
              color={`${totalValido ? '' : 'failure'}`}
              ref={im_TotalRef}
              readOnly
              type="number"
              addon="$"
              placeholder="Total"
              className={`dark:text-white mb-2 col-span-2 rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${totalValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
              value={formPedidos.im_TotalPedido}
              id="im_Total"
              name="im_Total"
              onChange={onInputChange}
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

      <div className="border-t-[0.3rem] mt-[3rem] border-[#d1cece]">
        <div className="flex justify-end gap-4 mt-4">
          {/* <Button
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
          </Button> */}
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
            Guardar Pedido
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
      </div>

      {/* Modal para Agregar */}
      <ModalPedidosDetalleAgregar
        isOpen={isModalDetalleOpen}
        onClose={closeDetalleModal}
        actualizarDetalles={setPedidosDetalles}
        row={
          pedidosDetalle
            ? pedidosDetalle
            : {
                id_Detalle: 0,
                id_Modelo: '',
                id_Talla: '',
                id_Color: '',
                id_TipoTela: '',
                id_TipoPrenda: '',
                de_Concepto: '',
                nu_Cantidad: 0,
                im_PrecioUnitario: 0,
                pj_Descuento: 0,
                im_SubTotal: 0,
                im_Impuesto: 0,
                im_Total: 0,
                de_Genero: '',
                id_Pedido: 0,
                de_GeneroCompleto: '',
                de_Modelo: '',
                de_Talla: '',
                de_Color: '',
                de_TipoTela: '',
                de_TipoPrenda: '',
              }
        }
        sn_Editar={sn_EditarDetalle}
        sn_Visualizar={sn_VisualizarDetalle}
        pedidosDetalles={pedidosDetalles}
      />

      <ModalConfirmacionAgregar
        isOpen={isModalOpen}
        onClose={cerrarModalConfirmacion}
        onConfirm={guardarPedido}
        objeto="Pedido"
        sn_editar={sn_Editar}
      />
    </div>
  );
};
