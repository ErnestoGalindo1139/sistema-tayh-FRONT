import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
import { IApiError, IClientes, IFormClientes } from '../interfaces/interfaces';
import {
  createClientes,
  getClientes,
  updateClientes,
} from '../helpers/apiClientes';
// import { Datepicker } from 'flowbite-react';

interface ModalClientesProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarClientes: (clientes: IClientes[]) => void;
  row: IFormClientes;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
}

export const ModalClientes = ({
  isOpen,
  onClose,
  actualizarClientes,
  row,
  sn_Editar,
  sn_Visualizar,
}: ModalClientesProps): React.JSX.Element => {
  // Referencias para los inputs
  const nb_ClienteRef = useRef<HTMLInputElement>(null);
  const de_DireccionRef = useRef<HTMLInputElement>(null);
  const de_CorreoElectronicoRef = useRef<HTMLInputElement>(null);
  const fh_CumpleanosRef = useRef<HTMLInputElement>(null);
  const fh_CumpleanosEmpresaRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoRedLocalRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoCelularRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoWhatsAppRef = useRef<HTMLInputElement>(null);

  // Manejar Validaciones para los Iputs
  const [nombreValido, setNombreValido] = useState(true);
  const [direccionValida, setDireccionValido] = useState(true);
  const [correoValido, setCorreoValido] = useState(true);
  const [cumpleanosValido, setCumpleanosValido] = useState(true);
  const [cumpleanosEmpresaValido, setCumpleanosEmpresaValido] = useState(true);
  const [telefonoRedLocalValido, setTelefonoRedLocalValido] = useState(true);
  const [telefonoCelularValido, setTelefonoCelularValido] = useState(true);
  const [telefonoWhatsAppValido, setTelefonoWhatsAppValido] = useState(true);

  const [formClientes, setFormClientes] = useState<IFormClientes>({
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

  useEffect(() => {
    const fetchClientes = async (): Promise<void> => {
      try {
        const clientesData = await getClientes({});
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

  const limpiarFormulario = (): void => {
    setFormClientes({
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
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormClientes({ ...formClientes, [name]: value });
  };

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

  const guardarCliente = async (): Promise<void> => {
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
      ) ||
      !validarCampo(
        formClientes.nu_TelefonoRedLocal,
        nu_TelefonoRedLocalRef,
        setTelefonoRedLocalValido,
        'Teléfono de Red Local'
      ) ||
      !validarCampo(
        formClientes.nu_TelefonoCelular,
        nu_TelefonoCelularRef,
        setTelefonoCelularValido,
        'Teléfono Celular'
      ) ||
      !validarCampo(
        formClientes.nu_TelefonoWhatsApp,
        nu_TelefonoWhatsAppRef,
        setTelefonoWhatsAppValido,
        'Teléfono para WhatsApp'
      )
    ) {
      return;
    }

    const payload = {
      ...formClientes,
    };

    setIsLoading(true);

    try {
      let response;

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
          text: 'No se pudo procesar la solicitud',
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
      const clientesData = await getClientes({});
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
      onClose(); // Cierra el modal o limpia el formulario
    }
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
        initialFocusRef={nb_ClienteRef}
        // finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="scale"
        lockFocusAcrossFrames={true}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {sn_Visualizar ? 'Visualizar' : sn_Editar ? 'Editar' : 'Agregar'}{' '}
            Cliente
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl className="flex justify-center gap-4">
              <div className="w-full">
                <FormLabel>Nombre del Cliente</FormLabel>
                <Input
                  isDisabled={sn_Visualizar}
                  ref={nb_ClienteRef}
                  placeholder="Nombre del cliente"
                  required
                  type="text"
                  autoComplete="off"
                  id="nb_Cliente"
                  name="nb_Cliente"
                  value={formClientes.nb_Cliente}
                  onChange={handleInputChange}
                  className={`mt-2 mb-2 w-full border ${nombreValido ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${nombreValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                />
              </div>
              <div className="w-full">
                <FormLabel>Dirección del Cliente</FormLabel>
                <Input
                  isDisabled={sn_Visualizar}
                  ref={de_DireccionRef}
                  placeholder="Dirección del Cliente"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_Direccion"
                  name="de_Direccion"
                  value={formClientes.de_Direccion}
                  onChange={handleInputChange}
                  className={`mt-2 mb-2 w-full border ${direccionValida ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${direccionValida ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                />
              </div>
              <div className="w-full">
                <FormLabel>Correo Electrónico</FormLabel>
                <Input
                  isDisabled={sn_Visualizar}
                  ref={de_CorreoElectronicoRef}
                  placeholder="correo@gmail.com"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_CorreoElectronico"
                  name="de_CorreoElectronico"
                  value={formClientes.de_CorreoElectronico}
                  onChange={handleInputChange}
                  className={`mt-2 mb-2 w-full border ${correoValido ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${correoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                />
              </div>
            </FormControl>
            <FormControl className="flex justify-center gap-4">
              <div className="w-full">
                <FormLabel>Teléfono Red Local</FormLabel>
                <Input
                  isDisabled={sn_Visualizar}
                  ref={nu_TelefonoRedLocalRef}
                  placeholder="Teléfono de red local"
                  required
                  type="text"
                  id="nu_TelefonoRedLocal"
                  name="nu_TelefonoRedLocal"
                  value={formClientes.nu_TelefonoRedLocal}
                  onChange={handleInputChange}
                  className={`mt-2 mb-2 w-full border ${
                    telefonoRedLocalValido
                      ? 'border-[#656ed3e1]'
                      : 'border-red-500'
                  } rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${
                    telefonoRedLocalValido ? 'ring-[#656ed3e1]' : 'ring-red-500'
                  } text-black`}
                />
              </div>
              <div className="w-full">
                <FormLabel>Teléfono Celular</FormLabel>
                <Input
                  isDisabled={sn_Visualizar}
                  ref={nu_TelefonoCelularRef}
                  placeholder="Teléfono celular"
                  required
                  type="text"
                  id="nu_TelefonoCelular"
                  name="nu_TelefonoCelular"
                  value={formClientes.nu_TelefonoCelular}
                  onChange={handleInputChange}
                  className={`mt-2 mb-2 w-full border ${
                    telefonoCelularValido
                      ? 'border-[#656ed3e1]'
                      : 'border-red-500'
                  } rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${
                    telefonoCelularValido ? 'ring-[#656ed3e1]' : 'ring-red-500'
                  } text-black`}
                />
              </div>
              <div className="w-full">
                <FormLabel>Teléfono WhatsApp</FormLabel>
                <Input
                  isDisabled={sn_Visualizar}
                  ref={nu_TelefonoWhatsAppRef}
                  placeholder="Teléfono WhatsApp"
                  required
                  type="text"
                  id="nu_TelefonoWhatsApp"
                  name="nu_TelefonoWhatsApp"
                  value={formClientes.nu_TelefonoWhatsApp}
                  onChange={handleInputChange}
                  className={`mt-2 mb-2 w-full border ${
                    telefonoWhatsAppValido
                      ? 'border-[#656ed3e1]'
                      : 'border-red-500'
                  } rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${
                    telefonoWhatsAppValido ? 'ring-[#656ed3e1]' : 'ring-red-500'
                  } text-black`}
                />
              </div>
            </FormControl>

            <FormControl className="flex justify-center gap-4">
              <div className="w-full">
                <FormLabel>Fecha de Cumpleaños Cliente</FormLabel>
                <Input
                  isDisabled={sn_Visualizar}
                  ref={fh_CumpleanosRef}
                  placeholder="Fecha de cumpleaños Cliente"
                  required
                  type="date"
                  id="fh_Cumpleanos"
                  name="fh_Cumpleanos"
                  value={formClientes.fh_Cumpleanos}
                  onChange={handleInputChange}
                  className={`mt-2 mb-2 w-full border ${cumpleanosValido ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${cumpleanosValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                />
              </div>
              <div className="w-full">
                <FormLabel>Fecha de Cumpleaños Empresa</FormLabel>
                {/* <Datepicker language="es-MX" /> */}
                <Input
                  isDisabled={sn_Visualizar}
                  ref={fh_CumpleanosEmpresaRef}
                  placeholder="Fecha de cumpleaños"
                  required
                  type="date"
                  id="fh_CumpleanosEmpresa"
                  name="fh_CumpleanosEmpresa"
                  value={formClientes.fh_CumpleanosEmpresa}
                  onChange={handleInputChange}
                  className={`mt-2 mb-2 w-full border ${cumpleanosEmpresaValido ? 'border-[#656ed3e1]' : 'border-red-500'} rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:${cumpleanosEmpresaValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                />
              </div>
            </FormControl>

            <FormControl>
              <FormLabel className="mt-4">
                <strong className="text-xl">Redes Sociales</strong>
              </FormLabel>
              {formClientes.redesSociales.map((red, index) => (
                <Box key={index} className="flex gap-4 mb-2">
                  <Input
                    placeholder="Nombre de la Red Social (e.g., Facebook)"
                    type="text"
                    width="150px"
                    value={red.de_RedSocial}
                    onChange={(e) =>
                      handleRedSocialChange(
                        index,
                        'de_RedSocial',
                        e.target.value
                      )
                    }
                    disabled={sn_Visualizar}
                    className="border border-gray-300 rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  />
                  <Input
                    placeholder="Enlace de la Red Social (e.g., https://facebook.com/usuario)"
                    type="url"
                    value={red.de_Enlace}
                    onChange={(e) =>
                      handleRedSocialChange(index, 'de_Enlace', e.target.value)
                    }
                    disabled={sn_Visualizar}
                    className="border border-gray-300 rounded-lg py-2 px-3 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  />
                  <Button
                    colorScheme="red"
                    onClick={() => removeRedSocial(index)}
                    disabled={sn_Visualizar}
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
              onClick={guardarCliente}
            >
              Guardar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
