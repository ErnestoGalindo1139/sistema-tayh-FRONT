/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import Toast from '../components/Toast';
import { WaitScreen } from '../components/WaitScreen';
import { Label, Select, TextInput } from 'flowbite-react';
import { ModalConfirmacionAgregar } from './ModalConfirmacionAgregar';
import {
  IColores,
  IModelos,
  ITallas,
  ITipoPrendas,
} from '../interfaces/interfacesPedidos';

import { useForm } from '../hooks/useForm';
import { useValidations } from '../hooks/useValidations';
import { useInputsInteraction } from '../hooks/useInputsInteraction';
import {
  IFiltrosInventarios,
  IFormInventarios,
  IInventarios,
} from '../interfaces/interfacesInventarios';
import {
  createInventarios,
  getInventarios,
  updateInventarios,
} from '../helpers/apiInventarios';
import {
  getColores,
  getModelosCombo,
  getTallas,
  getTipoPrendas,
} from '../helpers/apiPedidos';
import { IApiError } from '../interfaces/interfacesApi';

interface ModalInventariosAgregarProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarInventarios: (inventarios: IInventarios[]) => void;
  row: IFormInventarios;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
  filtros: IFiltrosInventarios;
}

export const ModalInventariosAgregar = ({
  isOpen,
  onClose,
  actualizarInventarios,
  row,
  sn_Editar,
  sn_Visualizar,
  filtros,
}: ModalInventariosAgregarProps): React.JSX.Element => {
  // Llenar los combos
  const [modelos, setModelos] = useState<IModelos[]>([]);
  const [tallas, setTallas] = useState<ITallas[]>([]);
  const [colores, setColores] = useState<IColores[]>([]);
  const [tipoPrendas, setTipoPrendas] = useState<ITipoPrendas[]>([]);

  // Referencias para los inputs
  const de_GeneroRef = useRef<HTMLSelectElement>(null);
  const id_ModeloRef = useRef<HTMLSelectElement>(null);
  const id_TallaRef = useRef<HTMLSelectElement>(null);
  const id_ColorRef = useRef<HTMLSelectElement>(null);
  const id_TipoPrendaRef = useRef<HTMLSelectElement>(null);
  const nu_CantidadRef = useRef<HTMLInputElement>(null);

  const [generoValido, setGeneroValido] = useState(true);
  const [modeloValido, setModeloValido] = useState(true);
  const [tallaValida, setTallaValida] = useState(true);
  const [colorValido, setColorValido] = useState(true);
  const [tipoPrendaValida, setTipoPrendaValida] = useState(true);
  const [cantidadValida, setCantidadValida] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cerrarFormulario, setCerrarFormulario] = useState(false);

  const {
    formState: formInventarios,
    setFormState: setFormInventarios,
    onInputChange,
    onResetForm: limpiarFormulario,
  } = useForm<IFormInventarios>({
    id_Inventario: '',
    id_Modelo: '',
    id_Talla: '',
    id_Color: '',
    id_TipoPrenda: '',
    de_Modelo: '',
    de_Talla: '',
    de_Color: '',
    de_TipoPrenda: '',
    de_Genero: '',
    de_GeneroCompleto: '',
    nu_Cantidad: '',
    sn_Activo: false,
    fh_Registro: '',
    fh_Actualizacion: '',
  });

  useEffect(() => {
    const fetchModelos = async (): Promise<void> => {
      try {
        if (formInventarios.de_Genero) {
          const modelosData = await getModelosCombo(formInventarios.de_Genero); // Modulo de Pedidos
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
  }, [formInventarios.de_Genero]);

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
        if (formInventarios.de_Genero) {
          const coloresData = await getColores(formInventarios.de_Genero); // Modulo de Pedidos
          setColores(coloresData.body);
        } else {
          setColores([]);
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

    fetchColores();
  }, [formInventarios.de_Genero]);

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

  // Hook para manejar todas las validaciones generales
  const { validarCampo } = useValidations();

  const seleccionarTextoInput = useInputsInteraction();

  const [isLoading, setIsLoading] = useState(false);

  // Limpiar Formulario
  useEffect(() => {
    if (isOpen) {
      limpiarFormulario();
      setFormInventarios({
        ...row,
      });
    }
  }, [isOpen, row]);

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

  const guardarInventarios = async (): Promise<void> => {
    const payload = {
      ...formInventarios,
    };

    setIsLoading(true);

    let response;

    console.log(payload, sn_Editar);

    try {
      if (sn_Editar) {
        // Si es editar, llama a updateInventarios
        response = await updateInventarios(payload);
      } else {
        // Si es crear, llama a createInventarios
        response = await createInventarios(payload);
      }

      // Si la respuesta no es exitosa, mostrar un error
      if (!response.success) {
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: response.message,
        });
        return;
      }

      // Mostrar mensaje de éxito
      Toast.fire({
        icon: 'success',
        title: 'Operación exitosa',
        text: response.message,
      });

      // Actualizar los clientes
      const inventariosData = await getInventarios(filtros);
      actualizarInventarios(inventariosData.body);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      Toast.fire({
        icon: 'error',
        title: 'Ocurrió un Error',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
      cerrarModalConfirmacion();

      if (response?.success) {
        if (cerrarFormulario) {
          onClose(); // Cierra el modal o limpia el formulario
        }
        const inventariosData = await getInventarios(filtros);
        actualizarInventarios(inventariosData.body);
      }
    }
  };

  const validarDatosFormulario = (cerrarForm: boolean = true): void => {
    if (
      !validarCampo(
        formInventarios.de_Genero,
        de_GeneroRef,
        setGeneroValido,
        'Genero'
      ) ||
      !validarCampo(
        formInventarios.id_Modelo,
        id_ModeloRef,
        setModeloValido,
        'Modelo'
      ) ||
      !validarCampo(
        formInventarios.id_TipoPrenda,
        id_TipoPrendaRef,
        setTipoPrendaValida,
        'Tipo Prenda'
      ) ||
      !validarCampo(
        formInventarios.id_Talla,
        id_TallaRef,
        setTallaValida,
        'Talla'
      ) ||
      !validarCampo(
        formInventarios.id_Color,
        id_ColorRef,
        setColorValido,
        'Color'
      ) ||
      !validarCampo(
        formInventarios.nu_Cantidad,
        nu_CantidadRef,
        setCantidadValida,
        'Cantidad'
      )
    ) {
      return;
    }

    setCerrarFormulario(cerrarForm);
    abrirModalConfirmacion();
  };

  return (
    <>
      {isLoading && <WaitScreen message="Guardando..." />}
      <Modal
        initialFocusRef={id_ModeloRef}
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
          width="85%"
          maxWidth="650px"
          height="auto"
          className="p-[1rem] mt-[4rem]"
          style={{ marginTop: '4rem' }}
        >
          <ModalHeader fontSize="4xl">
            {sn_Visualizar ? 'Visualizar' : sn_Editar ? 'Editar' : 'Agregar'}{' '}
            Inventario
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl className="grid grid-cols-2 gap-8">
              <div className="dark:text-white">
                <Label className="text-[1.6rem] dark:text-white font-semibold">
                  Genero
                </Label>
                <Select
                  disabled={sn_Visualizar}
                  ref={de_GeneroRef}
                  value={formInventarios.de_Genero}
                  color={`${generoValido ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${generoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="de_Genero"
                  name="de_Genero"
                  onChange={onInputChange}
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
                    disabled={!!formInventarios.de_Genero}
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
                  value={formInventarios.id_Modelo}
                  color={`${modeloValido ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${modeloValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_Modelo"
                  name="id_Modelo"
                  onChange={onInputChange}
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
                  value={formInventarios.id_TipoPrenda}
                  color={`${tipoPrendaValida ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tipoPrendaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_TipoPrenda"
                  name="id_TipoPrenda"
                  onChange={onInputChange}
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
                  value={formInventarios.id_Talla}
                  color={`${tallaValida ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tallaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_Talla"
                  name="id_Talla"
                  onChange={onInputChange}
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
                    disabled={!!formInventarios.id_Talla}
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
                  value={formInventarios.id_Color}
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
                <Label className="text-[1.6rem] font-bold">Cantidad</Label>
                <TextInput
                  disabled={sn_Visualizar}
                  ref={nu_CantidadRef}
                  color={`${cantidadValida ? '' : 'failure'}`}
                  type="number"
                  placeholder="Cantidad"
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${cantidadValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  value={formInventarios.nu_Cantidad}
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
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <div className="grid m-auto w-full gap-4 sm:grid-flow-col-dense sm:m-0 sm:w-auto">
              <Button
                hidden={sn_Editar}
                colorScheme="pink"
                onClick={() => validarDatosFormulario(false)}
                fontSize="2xl"
                size="lg"
              >
                Guardar y agregar Otro
              </Button>
              <Button
                isDisabled={sn_Visualizar}
                colorScheme="blue"
                onClick={() => validarDatosFormulario(true)}
                fontSize="2xl"
                size="lg"
              >
                Guardar
              </Button>
              <Button
                onClick={onClose}
                fontSize="2xl"
                size="lg"
                colorScheme="orange"
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
        onConfirm={guardarInventarios}
        objeto="Inventario"
        sn_editar={sn_Editar}
      />
    </>
  );
};
