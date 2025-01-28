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
import { Label, TextInput } from 'flowbite-react';
import { IApiError } from '../interfaces/interfacesApi';
import { IEnvios, IFormEnvios } from '../interfaces/interfacesEnvios';
import { getEnvios } from '../helpers/apiEnvios';
import { useForm } from '../hooks/useForm';

interface ModalEnviosProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarEnvios: (clientes: IEnvios[]) => void;
  row: IFormEnvios;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
}

export const ModalEnvios = ({
  isOpen,
  onClose,
  actualizarEnvios,
  row,
  sn_Editar,
  sn_Visualizar,
}: ModalEnviosProps): React.JSX.Element => {
  // Referencias para los inputs
  const nb_DestinatarioRef = useRef<HTMLInputElement>(null);
  const de_DireccionRef = useRef<HTMLInputElement>(null);
  const de_CorreoElectronicoRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoCelularRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoRedLocalRef = useRef<HTMLInputElement>(null);
  const de_FolioGuiaRef = useRef<HTMLInputElement>(null);

  // Manejar Validaciones para los Iputs
  const [nombreValido, setNombreValido] = useState(true);
  const [direccionValida, setDireccionValido] = useState(true);
  const [correoValido, setCorreoValido] = useState(true);
  const [telefonoRedLocalValido, setTelefonoRedLocalValido] = useState(true);

  const [formEnvios, setFormEnvios] = useState<IFormEnvios>({
    id_Envio: 0,
    id_Cliente: 0,
    nb_Destinatario: '',
    de_Direccion: '',
    de_CorreoElectronico: '',
    nu_TelefonoCelular: '',
    nu_TelefonoRedLocal: '',
    de_FolioGuia: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEnvios = async (): Promise<void> => {
      try {
        const enviosData = await getEnvios({});
        actualizarEnvios(enviosData.body);
      } catch (error) {
        // Asegurarte de que el error es de tipo ApiError
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      }
    };

    fetchEnvios();
  }, []);

  // Limpiar Formulario
  useEffect(() => {
    if (isOpen) {
      onResetForm();
      setFormEnvios({
        ...row,
      });
    }
  }, [isOpen, row]);

  const limpiarFormulario = (): void => {
    setFormEnvios({
      id_Envio: 0,
      id_Cliente: 0,
      nb_Destinatario: '',
      de_Direccion: '',
      de_CorreoElectronico: '',
      nu_TelefonoCelular: '',
      nu_TelefonoRedLocal: '',
      de_FolioGuia: '',
    });
  };

  // Convertir el string de fecha 'yyyy-MM-dd' a un objeto Date antes de pasarlo al Datepicker
  const getDateForPicker = (dateString: string): Date | null => {
    if (!dateString) return null; // Si no hay valor, retorna null
    const [year, month, day] = dateString.split('-');
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + 1)); // Convertir string 'yyyy-MM-dd' a un objeto Date ajustado a UTC
  };

  // const guardarEnvio = async (): Promise<void> => {
  //   if (
  //     !validarCampo(
  //       formEnvios.nb_Destinatario,
  //       nb_DestinatarioRef,
  //       setNombreValido,
  //       'Nombre del Cliente'
  //     ) ||
  //     !validarCampo(
  //       formEnvios.de_Direccion,
  //       de_DireccionRef,
  //       setDireccionValido,
  //       'Dirección del Cliente'
  //     ) ||
  //     !validarCampo(
  //       formEnvios.de_CorreoElectronico,
  //       de_CorreoElectronicoRef,
  //       setCorreoValido,
  //       'Correo del Cliente'
  //     ) ||
  //     !validarCampo(
  //       formEnvios.nu_TelefonoCelular,
  //       nu_TelefonoCelularRef,
  //       setCorreoValido,
  //       'Correo del Cliente'
  //     ) ||
  //     !validarCampo(
  //       formEnvios.nu_TelefonoRedLocal,
  //       de_CorreoElectronicoRef,
  //       setCorreoValido,
  //       'Correo del Cliente'
  //     ) ||
  //     !validarCampo(
  //       formEnvios.de_FolioGuia,
  //       de_FolioGuiaRef,
  //       setCorreoValido,
  //       'Correo del Cliente'
  //     )
  //   ) {
  //     return;
  //   }

  //   const payload = {
  //     ...formEnvios,
  //   };

  //   setIsLoading(true);

  //   let response;

  //   try {
  //     if (sn_Editar) {
  //       // Si es editar, llama a updateClientes
  //       response = await updateClientes(payload);
  //     } else {
  //       // Si es crear, llama a createClientes
  //       response = await createEnvios(payload);
  //     }

  //     // Si la respuesta no es exitosa, mostrar un error
  //     if (!response.success) {
  //       Toast.fire({
  //         icon: 'error',
  //         title: 'Ocurrió un Error',
  //         text: response.message,
  //       });
  //       return;
  //     }

  //     // Mostrar mensaje de éxito
  //     Toast.fire({
  //       icon: 'success',
  //       title: 'Operación exitosa',
  //       text: response.message,
  //     });

  //     // Actualizar las categorias
  //     const clientesData = await getClientes({});
  //     actualizarEnvios(clientesData.body);
  //   } catch (error: unknown) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : String(error);

  //     Toast.fire({
  //       icon: 'error',
  //       title: 'Ocurrió un Error',
  //       text: errorMessage,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //     if (response?.success) {
  //       onClose(); // Cierra el modal o limpia el formulario
  //     }
  //   }
  // };

  // Función para manejar otros cambios de input (no fecha)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormEnvios({ ...formEnvios, [name]: value });
  };

  const { setFormState, onInputChange, onResetForm } = useForm<{
    id_Envio: number;
    id_Cliente: number;
    nb_Destinatario: string;
    de_Direccion: string;
    de_CorreoElectronico: string;
    nu_TelefonoCelular: string;
    nu_TelefonoRedLocal: string;
    de_FolioGuia: string;
  }>({
    id_Envio: 0,
    id_Cliente: 0,
    nb_Destinatario: '',
    de_Direccion: '',
    de_CorreoElectronico: '',
    nu_TelefonoCelular: '',
    nu_TelefonoRedLocal: '',
    de_FolioGuia: '',
  });

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
        // initialFocusRef={nb_ClienteRef}
        // finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="scale"
        lockFocusAcrossFrames={true}
        size="w-full"
      >
        <ModalOverlay />
        <ModalContent
          maxWidth="1200px"
          height="auto"
          className="p-[1rem] mt-[4rem]"
          style={{ marginTop: '4rem' }}
        >
          <ModalHeader fontSize="4xl">
            {sn_Visualizar ? 'Visualizar' : sn_Editar ? 'Editar' : 'Agregar'}{' '}
            Envio
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-[1rem]">
              <div className="w-full">
                <Label className="text-[1.6rem]">Nombre del Destinatario</Label>
                <TextInput
                  disabled={sn_Visualizar}
                  // ref={nb_ClienteRef}
                  placeholder="Nombre del Destinatario"
                  required
                  type="text"
                  autoComplete="off"
                  id="nb_Destinatario"
                  name="nb_Destinatario"
                  value={formEnvios.nb_Destinatario}
                  onChange={onInputChange}
                  // className={`mb-2 w-full border ${nombreValido ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${nombreValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${nombreValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">
                  Dirección del Destinatario
                </Label>
                <TextInput
                  disabled={sn_Visualizar}
                  ref={de_DireccionRef}
                  placeholder="Dirección del Envio"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_Direccion"
                  name="de_Direccion"
                  value={formEnvios.de_Direccion}
                  onChange={onInputChange}
                  // className={`mt-2 mb-2 w-full border ${direccionValida ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${direccionValida ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${direccionValida ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
            </FormControl>
            <FormControl className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-[1rem]">
              <div className="w-full">
                <Label className="text-[1.6rem]">Correo Electrónico</Label>
                <TextInput
                  disabled={sn_Visualizar}
                  ref={de_CorreoElectronicoRef}
                  placeholder="correo@gmail.com"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_CorreoElectronico"
                  name="de_CorreoElectronico"
                  value={formEnvios.de_CorreoElectronico}
                  onChange={onInputChange}
                  // className={`mt-2 mb-2 w-full border ${correoValido ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${correoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${correoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Folio guia</Label>
                <TextInput
                  disabled={sn_Visualizar}
                  ref={de_DireccionRef}
                  placeholder="Dirección del Envio"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_Direccion"
                  name="de_Direccion"
                  value={formEnvios.de_Direccion}
                  onChange={onInputChange}
                  // className={`mt-2 mb-2 w-full border ${direccionValida ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${direccionValida ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${direccionValida ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
            </FormControl>

            <FormControl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <Label className="text-[1.6rem]">Teléfono Celular</Label>
                <TextInput
                  disabled={sn_Visualizar}
                  ref={nu_TelefonoRedLocalRef}
                  placeholder="Teléfono de Celular"
                  required
                  type="number"
                  id="nu_TelefonoCelular"
                  name="nu_TelefonoCelular"
                  value={formEnvios.nu_TelefonoCelular}
                  onChange={onInputChange}
                  // className={`mt-2 mb-2 w-full border ${
                  //   telefonoRedLocalValido
                  //     ? 'border-[#656ed3e1]'
                  //     : 'border-red-500'
                  // } rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${
                  //   telefonoRedLocalValido ? 'ring-[#656ed3e1]' : 'ring-red-500'
                  // } text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${telefonoRedLocalValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Teléfono Red Local</Label>
                <TextInput
                  disabled={sn_Visualizar}
                  ref={nu_TelefonoRedLocalRef}
                  placeholder="Teléfono de Celular"
                  required
                  type="number"
                  id="nu_TelefonoRedLocal"
                  name="nu_TelefonoRedLocal"
                  value={formEnvios.nu_TelefonoRedLocal}
                  onChange={onInputChange}
                  // className={`mt-2 mb-2 w-full border ${
                  //   telefonoRedLocalValido
                  //     ? 'border-[#656ed3e1]'
                  //     : 'border-red-500'
                  // } rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${
                  //   telefonoRedLocalValido ? 'ring-[#656ed3e1]' : 'ring-red-500'
                  // } text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${telefonoRedLocalValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
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
              // onClick={guardarEnvio}
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
    </>
  );
};
