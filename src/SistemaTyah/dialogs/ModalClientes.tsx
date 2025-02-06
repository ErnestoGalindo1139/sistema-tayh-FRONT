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
import {
  IClientes,
  IFiltrosClientes,
  IFormClientes,
} from '../interfaces/interfacesClientes';
import {
  createClientes,
  getClientes,
  updateClientes,
} from '../helpers/apiClientes';
import { Datepicker, DatepickerRef, Label, TextInput } from 'flowbite-react';
import { IApiError } from '../interfaces/interfacesApi';
import { customDatePickerTheme } from '../themes/customDatePickerTheme';
import { ModalConfirmacionAgregar } from './ModalConfirmacionAgregar';
import { useForm } from '../hooks/useForm';
import { useValidations } from '../hooks/useValidations';
import { useFormDate } from '../hooks/useFormDate';

interface ModalClientesProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarClientes: (clientes: IClientes[]) => void;
  row: IFormClientes;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
  filtros: IFiltrosClientes;
}

export const ModalClientes = ({
  isOpen,
  onClose,
  actualizarClientes,
  row,
  sn_Editar,
  sn_Visualizar,
  filtros,
}: ModalClientesProps): React.JSX.Element => {
  // Referencias para los inputs
  const nb_ClienteRef = useRef<HTMLInputElement>(null);
  const de_DireccionRef = useRef<HTMLInputElement>(null);
  const de_CorreoElectronicoRef = useRef<HTMLInputElement>(null);
  const fh_CumpleanosRef = useRef<DatepickerRef>(null);
  const fh_CumpleanosEmpresaRef = useRef<DatepickerRef>(null);
  const nu_TelefonoRedLocalRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoCelularRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoWhatsAppRef = useRef<HTMLInputElement>(null);

  const redSocialRefs = useRef<(HTMLInputElement | null)[]>([]);
  const enlaceRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Manejar Validaciones para los Iputs
  const [nombreValido, setNombreValido] = useState(true);
  const [direccionValida, setDireccionValido] = useState(true);
  const [correoValido, setCorreoValido] = useState(true);
  const [cumpleanosValido, setCumpleanosValido] = useState(true);
  const [cumpleanosEmpresaValido, setCumpleanosEmpresaValido] = useState(true);
  const [telefonoRedLocalValido, setTelefonoRedLocalValido] = useState(true);
  const [telefonoCelularValido, setTelefonoCelularValido] = useState(true);
  const [telefonoWhatsAppValido, setTelefonoWhatsAppValido] = useState(true);

  const [validacionesRedes, setValidacionesRedes] = useState<
    { de_RedSocial: boolean; de_Enlace: boolean }[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    formState: formClientes,
    setFormState: setFormClientes,
    onInputChange,
    onResetForm: limpiarFormulario,
  } = useForm<IFormClientes>({
    id_Cliente: '',
    nb_Cliente: '',
    de_Direccion: '',
    de_CorreoElectronico: '',
    de_FolioCliente: '',
    nb_Atendio: '',
    id_UsuarioRegistra: '',
    id_UsuarioModifica: '',
    id_UsuarioElimina: '',
    fh_Cumpleanos: '',
    fh_CumpleanosEmpresa: '',
    redesSociales: [],
    nu_TelefonoRedLocal: '',
    nu_TelefonoCelular: '',
    nu_TelefonoWhatsApp: '',
    fh_Registro: '',
    fh_Modificacion: '',
    fh_Eliminacion: '',
    sn_Activo: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Hook para manejar todas las validaciones generales
  const { validarCorreo, validarTelefono, validarCampo } = useValidations();

  // Hook Para manejar el cambio de Fechas
  const { handleDateChange, getDateForPicker } = useFormDate(
    formClientes,
    setFormClientes
  );

  useEffect(() => {
    const fetchClientes = async (): Promise<void> => {
      try {
        const clientesData = await getClientes(filtros);
        actualizarClientes(clientesData.body);
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

    fetchClientes();
  }, []);

  // Limpiar Formulario
  useEffect(() => {
    if (isOpen) {
      limpiarFormulario();
      setFormClientes({
        ...row,
      });
    }
  }, [isOpen, row]);

  const addRedSocial = (): void => {
    setFormClientes((prevState) => ({
      ...prevState,
      redesSociales: [
        ...prevState.redesSociales,
        { de_RedSocial: '', de_Enlace: '' },
      ],
    }));
  };

  const removeRedSocial = (index: number): void => {
    setFormClientes((prevState) => ({
      ...prevState,
      redesSociales: prevState.redesSociales.filter((_, i) => i !== index),
    }));
  };

  const handleRedSocialChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedRedesSociales = formClientes.redesSociales.map((red, i) =>
      i === index ? { ...red, [field]: value } : red
    );
    setFormClientes((prevState) => ({
      ...prevState,
      redesSociales: updatedRedesSociales,
    }));
  };

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

  const guardarCliente = async (): Promise<void> => {
    const payload = {
      ...formClientes,
    };

    setIsLoading(true);

    let response;

    try {
      if (sn_Editar) {
        // Si es editar, llama a updateClientes
        response = await updateClientes(payload);
      } else {
        // Si es crear, llama a createClientes
        response = await createClientes(payload);
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
      const clientesData = await getClientes(filtros);
      actualizarClientes(clientesData.body);
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
  //   if (date) {
  //     // Ajusta la fecha para evitar el desfase de zona horaria (mantener en zona local)
  //     const localDate = new Date(
  //       date.getTime() - date.getTimezoneOffset() * 60000
  //     ); // Ajuste de zona horaria

  //     // Convierte la fecha a formato 'yyyy-MM-dd'
  //     const formattedDate = localDate.toISOString().split('T')[0];

  //     // Actualiza el estado del campo correspondiente
  //     setFormClientes({
  //       ...formClientes,
  //       [fieldName]: formattedDate, // Usa el nombre del campo dinámicamente
  //     });
  //   } else {
  //     setFormClientes({
  //       ...formClientes,
  //       [fieldName]: '', // Si no hay fecha seleccionada, limpia el campo correspondiente
  //     });
  //   }
  // };

  // // Convertir el string de fecha 'yyyy-MM-dd' a un objeto Date antes de pasarlo al Datepicker
  // const getDateForPicker = (dateString: string): Date | null => {
  //   if (!dateString) return null; // Si no hay valor, retorna null
  //   const [year, month, day] = dateString.split('-');
  //   return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + 1)); // Convertir string 'yyyy-MM-dd' a un objeto Date ajustado a UTC
  // };

  const validarDatosFormulario = async (): Promise<void> => {
    if (
      !validarCampo(
        formClientes.nb_Cliente,
        nb_ClienteRef,
        setNombreValido,
        'Nombre del Cliente'
      ) ||
      !validarCampo(
        formClientes.de_Direccion,
        de_DireccionRef,
        setDireccionValido,
        'Dirección del Cliente'
      ) ||
      !validarCampo(
        formClientes.de_CorreoElectronico,
        de_CorreoElectronicoRef,
        setCorreoValido,
        'Correo del Cliente'
      ) ||
      !validarCampo(
        formClientes.fh_Cumpleanos,
        fh_CumpleanosRef,
        setCumpleanosValido,
        'Cumpleaños del Cliente'
      ) ||
      !validarCampo(
        formClientes.fh_CumpleanosEmpresa,
        fh_CumpleanosEmpresaRef,
        setCumpleanosEmpresaValido,
        'Cumpleaños de la Empresa'
      )
    ) {
      return;
    }

    // Validaciones más especificas

    // Validación de Correo
    if (
      !validarCorreo(
        formClientes.de_CorreoElectronico,
        de_CorreoElectronicoRef,
        setCorreoValido,
        'Correo Cliente'
      )
    ) {
      return;
    }

    // Telefonos en caso de contar con info
    if (formClientes.nu_TelefonoRedLocal) {
      if (
        !validarTelefono(
          formClientes.nu_TelefonoRedLocal,
          nu_TelefonoRedLocalRef,
          setTelefonoRedLocalValido,
          'Telefono de Red Local'
        )
      ) {
        return;
      }
    }

    if (formClientes.nu_TelefonoCelular) {
      if (
        !validarTelefono(
          formClientes.nu_TelefonoCelular,
          nu_TelefonoCelularRef,
          setTelefonoCelularValido,
          'Telefono Celular'
        )
      ) {
        return;
      }
    }

    if (formClientes.nu_TelefonoWhatsApp) {
      if (
        !validarTelefono(
          formClientes.nu_TelefonoWhatsApp,
          nu_TelefonoWhatsAppRef,
          setTelefonoWhatsAppValido,
          'Telefono WhatsApp'
        )
      ) {
        return;
      }
    }

    let contador = 0;

    for (let index = 0; index < formClientes.redesSociales.length; index++) {
      // Validar el nombre de la red social
      if (!formClientes.redesSociales[index].de_RedSocial) {
        actualizarEstadoValidaciones(index, 'de_RedSocial', false);
        redSocialRefs.current[index]?.focus();
        Toast.fire({
          icon: 'error',
          title: `Nombre de la Red Social (${index + 1}) es obligatorio`,
          text: 'Por favor, completa este campo.',
        });
        contador = 1;
        break;
      } else {
        contador = 0;
        actualizarEstadoValidaciones(index, 'de_RedSocial', true);
      }

      // Validar el enlace de la red social
      if (!formClientes.redesSociales[index].de_Enlace) {
        actualizarEstadoValidaciones(index, 'de_Enlace', false);
        enlaceRefs.current[index]?.focus();
        Toast.fire({
          icon: 'error',
          title: `Enlace de la Red Social (${index + 1}) es obligatorio`,
          text: 'Por favor, completa este campo.',
        });
        contador = 1;
        break;
      } else {
        contador = 0;
        actualizarEstadoValidaciones(index, 'de_Enlace', true);
      }
    }

    // Validar cada red social

    if (!contador) {
      abrirModalConfirmacion();
    }
  };

  // Función para inicializar o actualizar el estado de validaciones
  const actualizarEstadoValidaciones = (
    index: number,
    campo: 'de_RedSocial' | 'de_Enlace',
    esValido: boolean
  ): void => {
    setValidacionesRedes((prevState) => {
      const nuevoEstado = [...prevState];
      if (!nuevoEstado[index]) {
        // Inicializa el estado si no existe
        nuevoEstado[index] = { de_RedSocial: true, de_Enlace: true };
      }
      nuevoEstado[index][campo] = esValido;
      return nuevoEstado;
    });
  };

  return (
    <>
      {isLoading && <WaitScreen message="Guardando..." />}
      <Modal
        initialFocusRef={nb_ClienteRef}
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
          width="65%"
          maxWidth="1200px"
          height="auto"
          className="p-[1rem] mt-[4rem]"
          style={{ marginTop: '4rem' }}
        >
          <ModalHeader fontSize="4xl">
            {sn_Visualizar ? 'Visualizar' : sn_Editar ? 'Editar' : 'Agregar'}{' '}
            Cliente
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="w-full">
                <Label className="text-[1.6rem]">Nombre del Cliente</Label>
                <TextInput
                  color={`${nombreValido ? '' : 'failure'}`}
                  disabled={sn_Visualizar}
                  ref={nb_ClienteRef}
                  placeholder="Nombre del cliente"
                  required
                  type="text"
                  autoComplete="off"
                  id="nb_Cliente"
                  name="nb_Cliente"
                  value={formClientes.nb_Cliente}
                  onChange={onInputChange}
                  onBlur={() => setNombreValido(true)}
                  // className={`mb-2 w-full border ${nombreValido ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${nombreValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${nombreValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Dirección del Cliente</Label>
                <TextInput
                  color={`${direccionValida ? '' : 'failure'}`}
                  onBlur={() => setDireccionValido(true)}
                  disabled={sn_Visualizar}
                  ref={de_DireccionRef}
                  placeholder="Dirección del Cliente"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_Direccion"
                  name="de_Direccion"
                  value={formClientes.de_Direccion}
                  onChange={onInputChange}
                  // className={`mt-2 mb-2 w-full border ${direccionValida ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${direccionValida ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${direccionValida ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Correo Electrónico</Label>
                <TextInput
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
                  value={formClientes.de_CorreoElectronico}
                  onChange={onInputChange}
                  // className={`mt-2 mb-2 w-full border ${correoValido ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${correoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${correoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
            </FormControl>
            <FormControl className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="w-full">
                <Label className="text-[1.6rem]">Teléfono Red Local</Label>
                <TextInput
                  color={`${telefonoRedLocalValido ? '' : 'failure'}`}
                  onBlur={() => setTelefonoRedLocalValido(true)}
                  disabled={sn_Visualizar}
                  ref={nu_TelefonoRedLocalRef}
                  placeholder="Teléfono de red local"
                  required
                  type="number"
                  id="nu_TelefonoRedLocal"
                  name="nu_TelefonoRedLocal"
                  value={formClientes.nu_TelefonoRedLocal}
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
                <Label className="text-[1.6rem]">Teléfono Celular</Label>
                <TextInput
                  color={`${telefonoCelularValido ? '' : 'failure'}`}
                  onBlur={() => setTelefonoCelularValido(true)}
                  disabled={sn_Visualizar}
                  ref={nu_TelefonoCelularRef}
                  placeholder="Teléfono celular"
                  required
                  type="number"
                  id="nu_TelefonoCelular"
                  name="nu_TelefonoCelular"
                  value={formClientes.nu_TelefonoCelular}
                  onChange={onInputChange}
                  // className={`mt-2 mb-2 w-full border ${
                  //   telefonoCelularValido
                  //     ? 'border-[#656ed3e1]'
                  //     : 'border-red-500'
                  // } rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${
                  //   telefonoCelularValido ? 'ring-[#656ed3e1]' : 'ring-red-500'
                  // } text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${telefonoCelularValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Teléfono WhatsApp</Label>
                <TextInput
                  color={`${telefonoWhatsAppValido ? '' : 'failure'}`}
                  onBlur={() => setTelefonoWhatsAppValido(true)}
                  disabled={sn_Visualizar}
                  ref={nu_TelefonoWhatsAppRef}
                  placeholder="Teléfono WhatsApp"
                  required
                  type="number"
                  id="nu_TelefonoWhatsApp"
                  name="nu_TelefonoWhatsApp"
                  value={formClientes.nu_TelefonoWhatsApp}
                  onChange={onInputChange}
                  // className={`mt-2 mb-2 w-full border ${
                  //   telefonoWhatsAppValido
                  //     ? 'border-[#656ed3e1]'
                  //     : 'border-red-500'
                  // } rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${
                  //   telefonoWhatsAppValido ? 'ring-[#656ed3e1]' : 'ring-red-500'
                  // } text-black`}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:${telefonoWhatsAppValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
            </FormControl>

            <FormControl className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="w-full">
                <Label className="text-[1.6rem]">
                  Fecha de Cumpleaños Cliente
                </Label>
                <Datepicker
                  // key={formClientes.fh_Cumpleanos} // Cambia la clave cuando el valor cambia
                  color={`${cumpleanosValido ? '' : 'failure'}`}
                  ref={fh_CumpleanosRef}
                  disabled={sn_Visualizar}
                  placeholder="Fecha de cumpleaños Cliente"
                  id="fh_Cumpleanos"
                  name="fh_Cumpleanos"
                  value={getDateForPicker(formClientes.fh_Cumpleanos)} // Convertimos el string a Date ajustado a UTC
                  onChange={(date) => {
                    handleDateChange(date, 'fh_Cumpleanos');
                  }}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${cumpleanosValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  language="es-MX"
                  style={{ fontSize: '1.4rem', height: '4rem' }}
                  theme={customDatePickerTheme}
                  autoHide={false}
                  onBlur={() => setCumpleanosValido(true)}
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">
                  Fecha de Cumpleaños Empresa
                </Label>
                {/* <Datepicker language="es-MX" /> */}
                <Datepicker
                  // key={
                  //   formClientes.fh_CumpleanosEmpresa || 'fh_CumpleanosEmpresa'
                  // } // Cambia la clave cuando el valor cambia
                  color={`${cumpleanosEmpresaValido ? '' : 'failure'}`}
                  onBlur={() => setCumpleanosEmpresaValido(true)}
                  disabled={sn_Visualizar}
                  placeholder="Fecha de cumpleaños Empresa"
                  ref={fh_CumpleanosEmpresaRef}
                  required
                  id="fh_CumpleanosEmpresa"
                  name="fh_CumpleanosEmpresa"
                  value={getDateForPicker(formClientes.fh_CumpleanosEmpresa)} // Convertimos el string a Date ajustado a UTC
                  onChange={(date) => {
                    handleDateChange(date, 'fh_CumpleanosEmpresa');
                  }}
                  className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${cumpleanosEmpresaValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  language="es-MX"
                  style={{ fontSize: '1.4rem', height: '4rem' }}
                  theme={customDatePickerTheme}
                  autoHide={false}
                />
              </div>
            </FormControl>

            <FormControl>
              <FormLabel className="mt-4">
                <strong className="text-[1.6rem]">Redes Sociales</strong>
              </FormLabel>
              {formClientes.redesSociales.map((red, index) => (
                <Box
                  key={index}
                  className="items-center grid grid-cols-1 mt-[1rem] md:grid-cols-[25%_60%_12%] gap-4 md:mt-[1rem]"
                >
                  <TextInput
                    ref={(el) => (redSocialRefs.current[index] = el)}
                    placeholder="Nombre de la Red Social"
                    color={`${validacionesRedes[index]?.de_RedSocial === false ? 'failure' : ''}`}
                    type="text"
                    value={red.de_RedSocial}
                    onChange={(e) =>
                      handleRedSocialChange(
                        index,
                        'de_RedSocial',
                        e.target.value
                      )
                    }
                    disabled={sn_Visualizar}
                    className="rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 text-black flex-shrink"
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                  <TextInput
                    ref={(el) => (enlaceRefs.current[index] = el)}
                    placeholder="Enlace de la Red Social (e.g., https://facebook.com/usuario)"
                    type="url"
                    color={`${validacionesRedes[index]?.de_Enlace === false ? 'failure' : ''}`}
                    value={red.de_Enlace}
                    onChange={(e) =>
                      handleRedSocialChange(index, 'de_Enlace', e.target.value)
                    }
                    disabled={sn_Visualizar}
                    className="rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 text-black flex-1"
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                  <Button
                    colorScheme="red"
                    onClick={() => removeRedSocial(index)}
                    disabled={sn_Visualizar}
                    className="text-[1.6rem] h-full"
                    fontSize="xl"
                    size="lg"
                  >
                    Eliminar
                  </Button>
                </Box>
              ))}

              <Button
                colorScheme="blue"
                onClick={addRedSocial}
                disabled={sn_Visualizar}
                mt={4}
                fontSize="xl"
                size="lg"
              >
                Agregar Red Social
              </Button>
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
        onConfirm={guardarCliente}
        objeto="Cliente"
      />
    </>
  );
};
