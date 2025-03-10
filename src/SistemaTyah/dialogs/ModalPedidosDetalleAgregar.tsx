/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
  IColores,
  IFormPedidosDetalle,
  IModelos,
  IPedidosDetalles,
  ITallas,
  ITipoPrendas,
  ITipoTelas,
} from '../interfaces/interfacesPedidos';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { WaitScreen } from '../components/WaitScreen';
import { ModalConfirmacionAgregar } from './ModalConfirmacionAgregar';
import { Label, Select, TextInput } from 'flowbite-react';
import { useForm } from '../hooks/useForm';
import { calcularPrecioUnitarioHelper } from '../helpers/pedidos/calcularPrecioUnitarioHelper';
import { useValidations } from '../hooks/useValidations';
import { useInputsInteraction } from '../hooks/useInputsInteraction';
import { IApiError } from '../interfaces/interfacesApi';
import {
  getColores,
  getModelosCombo,
  getTallas,
  getTipoPrendas,
  getTipoTelas,
} from '../helpers/apiPedidos';
import Toast from '../components/Toast';

interface ModalPedidosDetalleAgregarProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarDetalles: (detalles: IPedidosDetalles[]) => void;
  row: IFormPedidosDetalle;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
  pedidosDetalles: IPedidosDetalles[];
}

export const ModalPedidosDetalleAgregar = ({
  isOpen,
  onClose,
  actualizarDetalles,
  row,
  sn_Editar,
  sn_Visualizar,
  pedidosDetalles,
}: ModalPedidosDetalleAgregarProps): React.JSX.Element => {
  const {
    formState: formPedidosDetalle,
    setFormState: setFormPedidosDetalle,
    onInputChange,
    onResetForm: limpiarFormulario,
  } = useForm<IFormPedidosDetalle>({
    ...row,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cerrarFormulario, setCerrarFormulario] = useState(false);

  const [modelos, setModelos] = useState<IModelos[]>([]);
  const [tallas, setTallas] = useState<ITallas[]>([]);
  const [colores, setColores] = useState<IColores[]>([]);
  const [tipoTelas, setTipoTelas] = useState<ITipoTelas[]>([]);
  const [tipoPrendas, setTipoPrendas] = useState<ITipoPrendas[]>([]);

  // const [pedidosDetalles, setPedidosDetalles] = useState<IPedidosDetalles[]>(
  //   []
  // );

  const seleccionarTextoInput = useInputsInteraction();

  // Hook para manejar todas las validaciones generales
  const { validarCampo, validarNumeroNegativo } = useValidations();

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

  useEffect(() => {
    actualizarDetalles(pedidosDetalles);
  }, [pedidosDetalles]);

  useEffect(() => {
    setFormPedidosDetalle(row); // Sincroniza el formulario con el nuevo row
  }, [isOpen]);

  useEffect(() => {
    const fetchModelos = async (): Promise<void> => {
      try {
        if (formPedidosDetalle.de_Genero) {
          const modelosData = await getModelosCombo(
            formPedidosDetalle.de_Genero
          ); // Modulo de Pedidos
          setModelos(modelosData.body);
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

    fetchModelos();
  }, [formPedidosDetalle.de_Genero]);

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
        const coloresData = await getColores(formPedidosDetalle.de_Genero); // Modulo de Pedidos
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
  }, [formPedidosDetalle.de_Genero]);

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
    // Calcular el SubTotal
    const im_SubTotal =
      Number(formPedidosDetalle.nu_Cantidad) *
      Number(formPedidosDetalle.im_PrecioUnitario);

    setFormPedidosDetalle({
      ...formPedidosDetalle,
      im_SubTotal,
    });
  }, [formPedidosDetalle.nu_Cantidad, formPedidosDetalle.im_PrecioUnitario]);

  const obtenerPrecioUnitario = async (
    target: HTMLSelectElement
  ): Promise<void> => {
    const { name, value } = target;

    // Actualizamos el campo correspondiente en el estado
    setFormPedidosDetalle((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Llamamos a la función para obtener el nuevo precio unitario
    const calculo = await calcularPrecioUnitarioHelper({
      ...formPedidosDetalle,
      [name]: value,
    });

    // Actualizamos el estado con el nuevo precio unitario
    setFormPedidosDetalle((prev) => ({
      ...prev,
      im_PrecioUnitario: calculo.body,
    }));
  };

  const validarDatosFormulario = (cerrarForm: boolean = true): void => {
    // Campos Nulos o Vacíos
    if (
      !validarCampo(
        formPedidosDetalle.de_Concepto,
        de_ConceptoRef,
        setConceptoValido,
        'Concepto'
      ) ||
      !validarCampo(
        formPedidosDetalle.de_Genero,
        de_GeneroRef,
        setGeneroValido,
        'Genero'
      ) ||
      !validarCampo(
        formPedidosDetalle.id_Modelo,
        id_ModeloRef,
        setModeloValido,
        'Modelo'
      ) ||
      !validarCampo(
        formPedidosDetalle.id_TipoPrenda,
        id_TipoPrendaRef,
        setTipoPrendaValida,
        'Tipo Prenda'
      ) ||
      !validarCampo(
        formPedidosDetalle.id_Talla,
        id_TallaRef,
        setTallaValida,
        'Talla'
      ) ||
      !validarCampo(
        formPedidosDetalle.id_Color,
        id_ColorRef,
        setColorValido,
        'Color'
      ) ||
      !validarCampo(
        formPedidosDetalle.id_TipoTela,
        id_TipoTelaRef,
        setTipoTelaValida,
        'Tipo Tela'
      ) ||
      !validarCampo(
        formPedidosDetalle.nu_Cantidad,
        nu_CantidadRef,
        setCantidadValida,
        'Cantidad'
      ) ||
      !validarCampo(
        formPedidosDetalle.im_PrecioUnitario,
        im_PrecioUnitarioRef,
        setPrecioValido,
        'Precio'
      ) ||
      !validarCampo(
        formPedidosDetalle.im_SubTotal,
        im_SubTotalRef,
        setSubtotalValido,
        'SubTotal'
      )
    ) {
      return;
    }

    // Validaciones más especificas

    // No se puede agragar Cantidad Negativa
    if (
      !validarNumeroNegativo(
        formPedidosDetalle.nu_Cantidad,
        nu_CantidadRef,
        setCantidadValida,
        'Cantidad'
      )
    ) {
      return;
    }

    setCerrarFormulario(cerrarForm);

    // Abrir Modal de confirmación una vez pasadas las validaciones
    abrirModalConfirmacion();
  };

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

  const guardarPedidoDetalle = async (): Promise<void> => {
    if (sn_Editar) {
      const updatedDetalles = pedidosDetalles.map((detalle) =>
        detalle.id_Detalle === formPedidosDetalle.id_Detalle
          ? { ...formPedidosDetalle } // Actualiza el detalle existente
          : detalle
      );
      actualizarDetalles(updatedDetalles);
    } else {
      const contador = pedidosDetalles.length;
      const nuevoDetalle = { ...formPedidosDetalle, id_Detalle: contador + 1 }; // Crear una nueva copia con id_Detalle único
      actualizarDetalles([...pedidosDetalles, nuevoDetalle]); // Agregar la copia del nuevo detalle
    }

    cerrarModalConfirmacion();

    if (cerrarFormulario) {
      onClose();
    }
  };

  return (
    <>
      {/* {isLoading && <WaitScreen message="Guardando..." />} */}
      <Modal
        initialFocusRef={de_ConceptoRef}
        // finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="scale"
        lockFocusAcrossFrames={true}
        size="w-full"
        closeOnOverlayClick={false}
        closeOnEsc={false}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent
          width="80%"
          maxWidth="1800px"
          height="auto"
          className="p-[1rem] mt-[4rem]"
          style={{ marginTop: '4rem' }}
        >
          <ModalHeader fontSize="4xl">
            {sn_Visualizar ? 'Visualizar' : sn_Editar ? 'Editar' : 'Agregar'}{' '}
            Pedido Detalle
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="mt-[2rem] sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[2.5rem] gap-y-[1rem]">
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
                  value={formPedidosDetalle.de_Concepto}
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
                  value={formPedidosDetalle.de_Genero}
                  color={`${generoValido ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${generoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="de_Genero"
                  name="de_Genero"
                  onChange={(e) => obtenerPrecioUnitario(e.target)}
                  onBlur={(e) => {
                    setGeneroValido(true);
                    const selectedId = e.target.value;
                    const genero = selectedId == 'H' ? 'Hombre' : 'Mujer';

                    setFormPedidosDetalle((prev) => ({
                      ...prev,
                      de_GeneroCompleto: genero,
                    }));
                  }}
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
                    disabled={!!formPedidosDetalle.de_Genero}
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
                  value={formPedidosDetalle.id_Modelo}
                  color={`${modeloValido ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${modeloValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_Modelo"
                  name="id_Modelo"
                  onChange={(e) => obtenerPrecioUnitario(e.target)}
                  onBlur={(e) => {
                    setModeloValido(true);
                    const selectedId = e.target.value;
                    const selectedModelo = modelos.find(
                      (m) => m.id_Modelo == selectedId
                    );

                    setFormPedidosDetalle((prev) => ({
                      ...prev,
                      de_Modelo: selectedModelo ? selectedModelo.de_Modelo : '',
                    }));
                  }}
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
                  value={formPedidosDetalle.id_TipoPrenda}
                  color={`${tipoPrendaValida ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tipoPrendaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_TipoPrenda"
                  name="id_TipoPrenda"
                  onChange={(e) => obtenerPrecioUnitario(e.target)}
                  onBlur={(e) => {
                    setTipoPrendaValida(true);
                    const selectedId = e.target.value;
                    const selectedTipoPrenda = tipoPrendas.find(
                      (m) => m.id_TipoPrenda == selectedId
                    );

                    setFormPedidosDetalle((prev) => ({
                      ...prev,
                      de_TipoPrenda: selectedTipoPrenda
                        ? selectedTipoPrenda.de_TipoPrenda
                        : '',
                    }));
                  }}
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
                  value={formPedidosDetalle.id_Talla}
                  color={`${tallaValida ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tallaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_Talla"
                  name="id_Talla"
                  onChange={(e) => obtenerPrecioUnitario(e.target)}
                  onBlur={(e) => {
                    setTallaValida(true);
                    const selectedId = e.target.value;
                    const selectedTalla = tallas.find(
                      (m) => m.id_Talla == selectedId
                    );

                    setFormPedidosDetalle((prev) => ({
                      ...prev,
                      de_Talla: selectedTalla ? selectedTalla.de_Talla : '',
                    }));
                  }}
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
                    disabled={!!formPedidosDetalle.id_Talla}
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
                  value={formPedidosDetalle.id_Color}
                  color={`${colorValido ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${colorValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_Color"
                  name="id_Color"
                  onChange={onInputChange}
                  onBlur={(e) => {
                    setColorValido(true);
                    const selectedId = e.target.value;
                    const selectedColor = colores.find(
                      (m) => m.id_Color == selectedId
                    );

                    setFormPedidosDetalle((prev) => ({
                      ...prev,
                      de_Color: selectedColor ? selectedColor.de_ColorTela : '',
                    }));
                  }}
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
                  value={formPedidosDetalle.id_TipoTela}
                  color={`${tipoTelaValida ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tipoTelaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_TipoTela"
                  name="id_TipoTela"
                  onChange={onInputChange}
                  onBlur={(e) => {
                    setTipoTelaValida(true);
                    const selectedId = e.target.value;
                    const selectedTela = tipoTelas.find(
                      (m) => m.id_TipoTela == selectedId
                    );

                    setFormPedidosDetalle((prev) => ({
                      ...prev,
                      de_TipoTela: selectedTela ? selectedTela.de_TipoTela : '',
                    }));
                  }}
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
                    disabled={!!formPedidosDetalle.id_TipoTela}
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
                  value={formPedidosDetalle.nu_Cantidad}
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
                <Label className="text-[1.6rem] font-bold">
                  Precio Unitario
                </Label>
                <TextInput
                  disabled={sn_Visualizar}
                  ref={im_PrecioUnitarioRef}
                  color={`${precioValido ? '' : 'failure'}`}
                  readOnly
                  type="number"
                  placeholder="Precio Unitario"
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${precioValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  value={formPedidosDetalle.im_PrecioUnitario}
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

              <div className="dark:text-white col-start-3">
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
                  value={formPedidosDetalle.im_SubTotal}
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
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="grid m-auto w-full gap-4 sm:grid-flow-col-dense sm:m-0 sm:w-auto">
              <Button
                hidden={sn_Editar || sn_Visualizar}
                colorScheme="pink"
                mr={3}
                onClick={() => validarDatosFormulario(false)}
                fontSize="2xl"
                size="lg"
                className="w-full"
              >
                Guardar y agregar Otro
              </Button>
              <Button
                hidden={sn_Visualizar}
                colorScheme="blue"
                mr={3}
                onClick={() => validarDatosFormulario(true)}
                fontSize="2xl"
                size="lg"
                className="w-full"
              >
                Guardar
              </Button>
              <Button
                onClick={onClose}
                fontSize="2xl"
                size="lg"
                colorScheme="orange"
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ModalConfirmacionAgregar
        isOpen={isModalOpen}
        onClose={cerrarModalConfirmacion}
        onConfirm={guardarPedidoDetalle}
        objeto="Detalle"
        sn_editar={sn_Editar}
      />
    </>
  );
};
