'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
import { IApiError } from '../interfaces/interfacesApi';
import { ModalConfirmacionAgregar } from './ModalConfirmacionAgregar';
import {
  IFiltrosPrecios,
  IFormPrecios,
  IPrecios,
} from '../interfaces/interfacesPrecios';
import { ITallas, ITipoPrendas } from '../interfaces/interfacesPedidos';
import { getTallas, getTipoPrendas } from '../helpers/apiPedidos';
import {
  createPrecios,
  getPrecios,
  updatePrecios,
} from '../helpers/apiPrecios';

interface ModalPreciosAgregarProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarPrecios: (precios: IPrecios[]) => void;
  row: IFormPrecios;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
  filtros: IFiltrosPrecios;
}

export const ModalPreciosAgregar = ({
  isOpen,
  onClose,
  actualizarPrecios,
  row,
  sn_Editar,
  sn_Visualizar,
  filtros,
}: ModalPreciosAgregarProps): React.JSX.Element => {
  // Referencias para los inputs
  const de_GeneroRef = useRef<HTMLSelectElement>(null);
  const id_TipoPrendaRef = useRef<HTMLSelectElement>(null);
  const id_TallaRef = useRef<HTMLSelectElement>(null);
  const im_PrecioUnitarioRef = useRef<HTMLInputElement>(null);

  // Manejar Validaciones para los Iputs
  const [generoValido, setGeneroValido] = useState(true);
  const [tipoPrendaValida, setTipoPrendaValida] = useState(true);
  const [tallaValida, setTallaValida] = useState(true);
  const [precioUnitarioValido, setPrecioUnitarioValido] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formPrecios, setFormPrecios] = useState<IFormPrecios>({
    id_Precio: 0,
    de_Genero: '',
    id_TipoPrenda: 0,
    id_Talla: 0,
    im_PrecioUnitario: 0,
  });

  const [tipoPrendas, setTipoPrendas] = useState<ITipoPrendas[]>([]);
  const [tallas, setTallas] = useState<ITallas[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Limpiar Formulario
  useEffect(() => {
    if (isOpen) {
      limpiarFormulario();
      setFormPrecios({
        ...row,
      });
    }
    console.log(row);
  }, [isOpen, row]);

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
    const fetchTallas = async (): Promise<void> => {
      try {
        const tallasData = await getTallas();
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
  });

  const limpiarFormulario = (): void => {
    setFormPrecios({
      id_Precio: 0,
      de_Genero: '',
      id_TipoPrenda: 0,
      id_Talla: 0,
      im_PrecioUnitario: 0,
    });
  };

  // Función para manejar otros cambios de input (no fecha)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormPrecios({ ...formPrecios, [name]: value });
  };

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

  const guardarPrecio = async (): Promise<void> => {
    const payload = {
      ...formPrecios,
    };

    setIsLoading(true);

    let response;

    try {
      if (sn_Editar) {
        // Si es editar, llama a updateClientes
        response = await updatePrecios(payload);
      } else {
        // Si es crear, llama a createClientes
        response = await createPrecios(payload);
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
      const clientesData = await getPrecios(filtros);
      actualizarPrecios(clientesData.body);
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
        onClose(); // Cierra el modal o limpia el formulario
      }
    }
  };

  const validarDatosFormulario = async (): Promise<void> => {
    if (
      !validarCampo(
        formPrecios.de_Genero,
        de_GeneroRef,
        setGeneroValido,
        'Genero'
      ) ||
      !validarCampo(
        formPrecios.id_TipoPrenda,
        id_TipoPrendaRef,
        setTipoPrendaValida,
        'Tipo Prenda'
      ) ||
      !validarCampo(
        formPrecios.id_Talla,
        id_TallaRef,
        setTallaValida,
        'Talla'
      ) ||
      !validarCampo(
        formPrecios.im_PrecioUnitario,
        im_PrecioUnitarioRef,
        setPrecioUnitarioValido,
        'Precio Unitario'
      )
    ) {
      return;
    }

    abrirModalConfirmacion();
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

  return (
    <>
      {isLoading && <WaitScreen message="Guardando..." />}
      <Modal
        initialFocusRef={de_GeneroRef}
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
          width="45%"
          maxWidth="1200px"
          height="auto"
          className="p-[1rem] mt-[4rem]"
          style={{ marginTop: '4rem' }}
        >
          <ModalHeader fontSize="4xl">
            {sn_Visualizar ? 'Visualizar' : sn_Editar ? 'Editar' : 'Agregar'}{' '}
            Precio
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="dark:text-white">
                <Label className="text-[1.6rem] dark:text-white font-semibold">
                  Genero
                </Label>
                <Select
                  disabled={sn_Visualizar}
                  ref={de_GeneroRef}
                  value={formPrecios.de_Genero}
                  color={`${generoValido ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${generoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="de_Genero"
                  name="de_Genero"
                  onChange={handleInputChange}
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
                    disabled={!!formPrecios.de_Genero}
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
                  Tipo Prenda
                </Label>
                <Select
                  disabled={sn_Visualizar}
                  ref={id_TipoPrendaRef}
                  value={formPrecios.id_TipoPrenda}
                  color={`${tipoPrendaValida ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tipoPrendaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_TipoPrenda"
                  name="id_TipoPrenda"
                  onChange={handleInputChange}
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
                  value={formPrecios.id_Talla}
                  color={`${tallaValida ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${tallaValida ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="id_Talla"
                  name="id_Talla"
                  required
                  onChange={handleInputChange}
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
                <Label className="text-[1.6rem] font-bold">
                  Precio Unitario
                </Label>
                <TextInput
                  disabled={sn_Visualizar}
                  ref={im_PrecioUnitarioRef}
                  color={`${precioUnitarioValido ? '' : 'failure'}`}
                  type="number"
                  placeholder="Precio Unitario"
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${precioUnitarioValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  value={formPrecios.im_PrecioUnitario}
                  id="im_PrecioUnitario"
                  name="im_PrecioUnitario"
                  addon="$"
                  required
                  onChange={handleInputChange}
                  style={{
                    fontSize: '1.4rem',
                    border: '1px solid #b9b9b9',
                    backgroundColor: '#FFFFFF',
                  }}
                  onBlur={() => setPrecioUnitarioValido(true)}
                  sizing="lg"
                />
              </div>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={sn_Visualizar}
              colorScheme="blue"
              mr={3}
              onClick={validarDatosFormulario}
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
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ModalConfirmacionAgregar
        isOpen={isModalOpen}
        onClose={cerrarModalConfirmacion}
        onConfirm={guardarPrecio}
        objeto="Precio"
      />
    </>
  );
};
