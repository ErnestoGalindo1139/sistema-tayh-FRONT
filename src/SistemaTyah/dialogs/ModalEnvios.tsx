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
import { Label } from 'flowbite-react';
import { IApiError } from '../interfaces/interfacesApi';
import { IEnvios } from '../interfaces/interfacesEnvios';
import { createEnvios, getEnvios, updateEnvios } from '../helpers/apiEnvios';
import { useForm } from '../hooks/useForm';
import { getClientesCombo } from '../helpers/apiClientes';
import { IClientesCombo } from '../interfaces/interfacesClientes';
import { CustomSelect } from '../components/custom/CustomSelect';
import { CustomInput } from '../components/custom/CustomInput';
import { ModalConfirmacionAgregar } from './ModalConfirmacionAgregar';
import { IEstatus } from '../interfaces/interfacesEstatus';
import { getEstatus } from '../helpers/apiEstatus';

interface ModalEnviosProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarEnvios: (clientes: IEnvios[]) => void;
  row: IEnvios;
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
  const id_ClienteRef = useRef<HTMLSelectElement>(null);
  const de_DireccionRef = useRef<HTMLInputElement>(null);
  const de_CorreoElectronicoRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoCelularRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoRedLocalRef = useRef<HTMLInputElement>(null);
  const de_FolioGuiaRef = useRef<HTMLInputElement>(null);
  const id_EstatusRef = useRef<HTMLSelectElement>(null);

  // Manejar Validaciones para los Iputs
  const [clienteValido, setClienteValido] = useState(true);
  const [direccionValida, setDireccionValido] = useState(true);
  const [correoValido, setCorreoValido] = useState(true);
  const [telefonoCelularValido, setTelefonoCelularValido] = useState(true);
  const [telefonoRedLocalValido, setTelefonoRedLocalValido] = useState(true);
  const [folioGuiaValido, setFolioGuiaValido] = useState(true);
  const [estatusEnvios, setEstatusEnvios] = useState<IEstatus[]>([]);
  const [estatusValido, setEstatusValido] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [clientesCombo, setClientesCombo] = useState<IClientesCombo[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

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

    const fetchClientesCombo = async (): Promise<void> => {
      try {
        const arregloCombo = await getClientesCombo();
        setClientesCombo(arregloCombo.body);
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

    const fetchEstatusEnvios = async (): Promise<void> => {
      try {
        const estatusData = await getEstatus(3); // Modulo de Pedidos
        setEstatusEnvios(estatusData.body);
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

    fetchEnvios();
    fetchClientesCombo();
    fetchEstatusEnvios();
  }, []);

  // Limpiar Formulario
  useEffect(() => {
    if (isOpen) {
      if (sn_Editar) {
        setFormState({
          ...row,
          id_Cliente: Number(row.id_Cliente),
        });
      } else if (sn_Visualizar) {
        setFormState({
          ...row,
          id_Cliente: Number(row.id_Cliente),
        });
      } else {
        onResetForm();
      }
    }
  }, [isOpen, row]);

  const guardarEnvio = async (): Promise<void> => {
    const payload = {
      ...formState,
    };

    setIsLoading(true);

    let response;

    try {
      if (sn_Editar) {
        // Si es editar, llama a updateEnvios
        response = await updateEnvios(payload);
      } else {
        // Si es crear, llama a createClientes
        response = await createEnvios(payload);
      }

      // Si la respuesta no es exitosa, mostrar un error
      if (response && !response.success) {
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: response?.message || 'Operación exitosa',
        });
        return;
      }

      // Mostrar mensaje de éxito
      Toast.fire({
        icon: 'success',
        title: 'Operación exitosa',
        text: response.message,
      });

      // Actualizar las categorias
      const clientesData = await getEnvios({});
      actualizarEnvios(clientesData.body);
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
      if (response?.success) {
        onClose(); // Cierra el modal o limpia el formulario
        cerrarModalConfirmacion();
      }
    }
  };

  const { formState, setFormState, onInputChange, onResetForm } = useForm<{
    id_Envio: number;
    id_Cliente: number;
    de_Direccion: string;
    de_CorreoElectronico: string;
    nu_TelefonoCelular: string;
    nu_TelefonoRedLocal: string;
    de_FolioGuia: string;
    id_Estatus: number;
  }>({
    id_Envio: 0,
    id_Cliente: 0,
    de_Direccion: '',
    de_CorreoElectronico: '',
    nu_TelefonoCelular: '',
    nu_TelefonoRedLocal: '',
    de_FolioGuia: '',
    id_Estatus: 0,
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

  // Función para validar un número de teléfono
  const validarCorreo = (
    correo: string,
    ref: React.RefObject<HTMLElement>,
    setEstadoValido: React.Dispatch<React.SetStateAction<boolean>>,
    campoNombre: string
  ): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      ref.current?.focus();
      setEstadoValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoNombre} Invalido`,
        text: `Por favor Ingrese un Correo Válido`,
      });
      return false;
    }
    setEstadoValido(true);
    return true;
  };

  // Función para validar un número de teléfono
  const validarTelefono = (
    numero: string,
    ref: React.RefObject<HTMLElement>,
    setEstadoValido: React.Dispatch<React.SetStateAction<boolean>>,
    campoNombre: string
  ): boolean => {
    const telefonoRegex = /^[0-9]{7,15}$/; // Acepta solo números de 7 a 15 dígitos
    if (!telefonoRegex.test(numero)) {
      ref.current?.focus();
      setEstadoValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoNombre} Invalido`,
        text: `Por favor Ingrese un Telefono Válido`,
      });
      return false;
    }
    setEstadoValido(true);
    return true;
  };

  const validarDatosFormulario = async (): Promise<void> => {
    if (
      !validarCampo(
        formState.id_Cliente,
        id_ClienteRef,
        setClienteValido,
        'Seleccione un Cliente'
      ) ||
      !validarCampo(
        formState.de_Direccion,
        de_DireccionRef,
        setDireccionValido,
        'Agregue una Dirección'
      ) ||
      !validarCampo(
        formState.de_CorreoElectronico,
        de_CorreoElectronicoRef,
        setCorreoValido,
        'Agregue un Correo'
      ) ||
      !validarCampo(
        formState.nu_TelefonoCelular,
        nu_TelefonoCelularRef,
        setTelefonoCelularValido,
        'Ingrese un numero de telefono celular'
      ) ||
      !validarCampo(
        formState.nu_TelefonoRedLocal,
        nu_TelefonoRedLocalRef,
        setTelefonoRedLocalValido,
        'Ingrese un numero de telefono red local'
      ) ||
      !validarCampo(
        formState.de_FolioGuia,
        de_FolioGuiaRef,
        setFolioGuiaValido,
        'Ingrese un folio de guia'
      ) ||
      (sn_Editar &&
        !validarCampo(
          formState.id_Estatus,
          id_EstatusRef,
          setEstatusValido,
          'Ingrese un estatus'
        ))
    ) {
      return;
    }

    // Validaciones más especificas

    // Validación de Correo
    if (
      !validarCorreo(
        formState.de_CorreoElectronico,
        de_CorreoElectronicoRef,
        setCorreoValido,
        'Correo Cliente'
      )
    ) {
      return;
    }

    // Telefonos en caso de contar con info
    if (formState.nu_TelefonoRedLocal) {
      if (
        !validarTelefono(
          formState.nu_TelefonoRedLocal,
          nu_TelefonoRedLocalRef,
          setTelefonoRedLocalValido,
          'Telefono de Red Local'
        )
      ) {
        return;
      }
    }

    if (formState.nu_TelefonoCelular) {
      if (
        !validarTelefono(
          formState.nu_TelefonoCelular,
          nu_TelefonoCelularRef,
          setTelefonoCelularValido,
          'Telefono Celular'
        )
      ) {
        return;
      }
    }

    abrirModalConfirmacion();
  };

  return (
    <>
      {isLoading && <WaitScreen message="Guardando..." />}
      <Modal
        initialFocusRef={id_ClienteRef}
        finalFocusRef={de_FolioGuiaRef}
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
            Envío
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl className="grid grid-cols-1 md:grid-cols-3 gap-[2rem] mb-[1rem]">
              <div className="w-full">
                <Label className="text-[1.6rem]">Cliente</Label>
                <CustomSelect
                  disabled={sn_Visualizar}
                  color={`${clienteValido ? '' : 'failure'}`}
                  onBlur={() => setClienteValido(true)}
                  className={`dark:text-white mt-2 mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${clienteValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  ref={id_ClienteRef}
                  name="id_Cliente"
                  value={formState.id_Cliente}
                  onChange={onInputChange}
                >
                  <option value="">Seleccionar</option>
                  {clientesCombo.map((cliente) => (
                    <option key={cliente.id_Cliente} value={cliente.id_Cliente}>
                      {cliente.nb_Cliente}
                    </option>
                  ))}
                </CustomSelect>
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">
                  Dirección del Destinatario
                </Label>
                <CustomInput
                  color={`${direccionValida ? '' : 'failure'}`}
                  onBlur={() => setDireccionValido(true)}
                  disabled={sn_Visualizar}
                  ref={de_DireccionRef}
                  placeholder="Dirección del Envio"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_Direccion"
                  name="de_Direccion"
                  value={formState.de_Direccion}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${direccionValida ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Correo Electrónico</Label>
                <CustomInput
                  color={`${correoValido ? '' : 'failure'}`}
                  onBlur={() => setCorreoValido(true)}
                  disabled={sn_Visualizar}
                  ref={de_CorreoElectronicoRef}
                  placeholder="correo@gmail.com"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_CorreoElectronico"
                  name="de_CorreoElectronico"
                  value={formState.de_CorreoElectronico}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${correoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
            </FormControl>
            <FormControl className="grid grid-cols-1 md:grid-cols-3 gap-[2rem] mb-[1rem]">
              <div className="w-full">
                <Label className="text-[1.6rem]">Teléfono Celular</Label>
                <CustomInput
                  color={`${telefonoCelularValido ? '' : 'failure'}`}
                  onBlur={() => setTelefonoCelularValido(true)}
                  disabled={sn_Visualizar}
                  ref={nu_TelefonoRedLocalRef}
                  placeholder="Teléfono de Celular"
                  required
                  type="number"
                  id="nu_TelefonoCelular"
                  name="nu_TelefonoCelular"
                  value={formState.nu_TelefonoCelular}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${telefonoCelularValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Teléfono Red Local</Label>
                <CustomInput
                  color={`${telefonoRedLocalValido ? '' : 'failure'}`}
                  onBlur={() => setTelefonoRedLocalValido(true)}
                  disabled={sn_Visualizar}
                  ref={nu_TelefonoRedLocalRef}
                  placeholder="Teléfono Red Local"
                  required
                  type="number"
                  id="nu_TelefonoRedLocal"
                  name="nu_TelefonoRedLocal"
                  value={formState.nu_TelefonoRedLocal}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${telefonoRedLocalValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Folio guía</Label>
                <CustomInput
                  color={`${folioGuiaValido ? '' : 'failure'}`}
                  onBlur={() => setFolioGuiaValido(true)}
                  disabled={sn_Visualizar}
                  ref={de_FolioGuiaRef}
                  placeholder="Folio guía"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_FolioGuia"
                  name="de_FolioGuia"
                  value={formState.de_FolioGuia}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${folioGuiaValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
            </FormControl>

            <FormControl className="grid grid-cols-1 md:grid-cols-3 gap-[2rem]">
              <div className="w-full">
                <Label className={`text-[1.6rem] ${sn_Editar ? '' : 'hidden'}`}>
                  Estatus
                </Label>
                <CustomSelect
                  disabled={sn_Visualizar}
                  color={`${estatusValido ? '' : 'failure'}`}
                  onBlur={() => setEstatusValido(true)}
                  className={`dark:text-white mt-2 mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${estatusValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} ${sn_Editar ? '' : 'hidden'}`}
                  ref={id_EstatusRef}
                  name="id_Estatus"
                  value={formState.id_Estatus}
                  onChange={onInputChange}
                >
                  <option value="">Seleccionar</option>
                  {estatusEnvios.map((estatus) => (
                    <option key={estatus.id_Estatus} value={estatus.id_Estatus}>
                      {estatus.de_Estatus}
                    </option>
                  ))}
                </CustomSelect>
              </div>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              hidden={sn_Visualizar}
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
        onConfirm={guardarEnvio}
        objeto="Envio"
        sn_editar={sn_Editar}
      />
    </>
  );
};
