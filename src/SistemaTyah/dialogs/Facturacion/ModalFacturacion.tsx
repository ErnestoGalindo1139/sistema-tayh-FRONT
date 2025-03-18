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
import {
  IFacturacion,
  IFormFacturacion,
} from '../../interfaces/interfacesFacturacion';
import {
  createFactura,
  getFacturas,
  updateFactura,
} from '../../helpers/facturacion/apiFacturacion';
import { IApiError } from '../../interfaces/interfacesApi';
import Toast from '../../components/Toast';
import { getClientesCombo } from '../../helpers/apiClientes';
import { useForm } from '../../hooks/useForm';
import { WaitScreen } from '../../components/WaitScreen';
import { Label } from 'flowbite-react';
import { CustomSelect } from '../../components/custom/CustomSelect';
import { IClientesCombo } from '../../interfaces/interfacesClientes';
import { CustomInput } from '../../components/custom/CustomInput';
import { ModalConfirmacionAgregar } from '../ModalConfirmacionAgregar';
import { IPedidosDisponiblesCombo } from '../../interfaces/interfacesPedidos';
import { getPedidosDisponiblesCombo } from '../../helpers/apiPedidos';
import { CustomMultiSelect } from '../../components/custom/CustomMultiSelect';
import { CustomSelectValue } from '../../interfaces/interfacesGlobales';

interface ModalFacturasProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarFacturas: (facturas: IFacturacion[]) => void;
  row: IFacturacion;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
}

export const ModalFacturacion = ({
  isOpen,
  onClose,
  actualizarFacturas,
  row,
  sn_Editar,
  sn_Visualizar,
}: ModalFacturasProps): React.JSX.Element => {
  // Referencias para los inputs
  const id_PedidoRef = useRef<HTMLSelectElement>(null);
  const id_ClienteRef = useRef<HTMLSelectElement>(null);
  const de_DomicilioRef = useRef<HTMLInputElement>(null);
  const nu_TelefonoRef = useRef<HTMLInputElement>(null);
  const de_CorreoElectronicoRef = useRef<HTMLInputElement>(null);
  const de_RFCRef = useRef<HTMLInputElement>(null);
  const de_RegimenRef = useRef<HTMLInputElement>(null);
  const de_UsoRef = useRef<HTMLInputElement>(null);
  const sn_ConstanciaFiscalRef = useRef<HTMLSelectElement>(null);
  const sn_ActivoRef = useRef<HTMLSelectElement>(null);

  // Manejar Validaciones para los Iputs
  const [pedidoValido, setPedidoValido] = useState(true);
  const [clienteValido, setClienteValido] = useState(true);
  const [domicilioValido, setDomicilioValido] = useState(true);
  const [telefonoValido, setTelefonoValido] = useState(true);
  const [correoValido, setCorreoValido] = useState(true);
  const [RFCValido, setRFCValido] = useState(true);
  const [regimenValido, setRegimenValido] = useState(true);
  const [usoValido, setUsoValido] = useState(true);
  const [constanciaValida, setConstanciaValida] = useState(true);
  const [estatusValido, setEstatusValido] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [clientesCombo, setClientesCombo] = useState<IClientesCombo[]>([]);
  const [pedidosDisponiblesCombo, setPedidosDisponiblesCombo] = useState<
    IPedidosDisponiblesCombo[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

  const { formState, setFormState, onInputChange, onResetForm } =
    useForm<IFormFacturacion>({
      id_Factura: 0,
      id_Pedido: 0,
      pedidos: '',
      id_Cliente: 0,
      de_Domicilio: '',
      nu_Telefono: '',
      de_CorreoElectronico: '',
      de_RFC: '',
      de_Regimen: '',
      de_Uso: '',
      sn_ConstanciaFiscal: null,
      sn_Activo: null,
    });

  const fetchPedidosDisponiblesCombo = async (
    sn_Todos?: number,
    id_Cliente?: number
  ): Promise<void> => {
    try {
      const params = {
        sn_Todos,
        id_Cliente,
      };

      const arregloCombo = await getPedidosDisponiblesCombo(params);

      if (
        !arregloCombo.body ||
        !Array.isArray(arregloCombo.body) ||
        arregloCombo.body.length === 0
      ) {
        setPedidosDisponiblesCombo([]);
      } else {
        setPedidosDisponiblesCombo(arregloCombo.body);
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

  useEffect(() => {
    const fetchEnvios = async (): Promise<void> => {
      try {
        const facturasData = await getFacturas({});
        actualizarFacturas(facturasData.body);
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

    fetchEnvios();
    fetchClientesCombo();
  }, []);

  // Limpiar Formulario
  useEffect(() => {
    if (isOpen) {
      if (sn_Editar) {
        fetchPedidosDisponiblesCombo(1);

        setFormState({
          ...row,
          id_Cliente: Number(row.id_Cliente),
        });
      } else if (sn_Visualizar) {
        fetchPedidosDisponiblesCombo(1);
        setFormState({
          ...row,
          id_Cliente: Number(row.id_Cliente),
        });
      } else {
        onResetForm();
      }
    }
  }, [isOpen, row]);

  useEffect(() => {
    const actualizarInfoPedido = async (
      sn_Todos?: number,
      id_Cliente?: number
    ): Promise<void> => {
      setFormState((prevState) => ({
        ...prevState,
        id_Pedido: (prevState.id_Pedido = 0), // Cambia temporalmente para forzar el cambio
      }));

      await fetchPedidosDisponiblesCombo(sn_Todos, id_Cliente);

      if (!pedidosDisponiblesCombo) return;

      const pedidoInfo = pedidosDisponiblesCombo.filter((pedido) => {
        return formState.id_Cliente === Number(pedido.id_Cliente);
      });

      if (pedidoInfo.length === 0) return; // Si no hay coincidencias, salir

      const { de_CorreoElectronico } = pedidoInfo[0];

      setFormState((prevState) => ({
        ...prevState,
        id_Cliente: Number(pedidoInfo[0].id_Cliente),
        de_CorreoElectronico: de_CorreoElectronico || '',
      }));
    };

    if (formState.id_Cliente) {
      actualizarInfoPedido(undefined, formState.id_Cliente);
    }
  }, [formState.id_Cliente]);

  const guardarFactura = async (): Promise<void> => {
    const pedidos = Array.isArray(formState.id_Pedido)
      ? formState.id_Pedido
          .map((pedido: { value: unknown }) => pedido.value)
          .toString()
      : '';

    formState.pedidos = pedidos;

    const payload = {
      ...formState,
    };

    setIsLoading(true);

    let response;

    try {
      if (sn_Editar) {
        // Si es editar, llama a updateFactura
        response = await updateFactura(payload);
      } else {
        // Si es crear, llama a createFactura
        response = await createFactura(payload);
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
      const facturasData = await getFacturas({});
      actualizarFacturas(facturasData.body);
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
        Array.isArray(formState.id_Pedido)
          ? Number(formState.id_Pedido[0])
          : Number(formState.id_Pedido),
        id_PedidoRef,
        setPedidoValido,
        'Seleccione un Pedido'
      ) ||
      !validarCampo(
        formState.de_Domicilio,
        de_DomicilioRef,
        setClienteValido,
        'Seleccione un Cliente'
      ) ||
      !validarCampo(
        formState.de_CorreoElectronico,
        de_CorreoElectronicoRef,
        setDomicilioValido,
        'Agregue un Domicilio'
      ) ||
      !validarCampo(
        formState.nu_Telefono,
        nu_TelefonoRef,
        setTelefonoValido,
        'Ingrese un numero de Telefono celular'
      ) ||
      !validarCampo(
        formState.de_RFC,
        de_RFCRef,
        setRFCValido,
        'Ingrese un RFC'
      ) ||
      !validarCampo(
        formState.de_Regimen,
        de_RegimenRef,
        setRegimenValido,
        'Ingrese un Regimen'
      ) ||
      !validarCampo(
        formState.de_Uso,
        de_UsoRef,
        setUsoValido,
        'Ingrese un Uso valido'
      )
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

    if (formState.nu_Telefono) {
      if (
        !validarTelefono(
          formState.nu_Telefono,
          nu_TelefonoRef,
          setTelefonoValido,
          'Telefono Celular'
        )
      ) {
        return;
      }
    }

    abrirModalConfirmacion();
  };

  const arregloComboPedidos = pedidosDisponiblesCombo.map((pedido) => {
    // Asegurarse de que `id_Pedido` sea siempre un número, o un string si lo prefieres
    const value = pedido.id_Pedido ?? 0; // Asigna 0 si `id_Cliente` es `undefined`
    return {
      value:
        typeof value === 'number' || !isNaN(Number(value)) ? Number(value) : 0, // Asegúrate de convertir el valor a un número si es posible
      label: pedido.de_Pedido || 'Cliente desconocido', // Asegúrate de que `label` siempre tenga un valor
    };
  });

  return (
    <>
      {isLoading && <WaitScreen message="Guardando..." />}
      <Modal
        initialFocusRef={id_PedidoRef}
        finalFocusRef={sn_ActivoRef}
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
            Factura
          </ModalHeader>
          <ModalCloseButton size={'lg'} />
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
                <Label className="text-[1.6rem]">Folio Pedido</Label>
                {/* <CustomSelect
                  disabled={sn_Visualizar}
                  color={`${pedidoValido ? '' : 'failure'}`}
                  onBlur={() => setPedidoValido(true)}
                  className={`dark:text-white mt-2 mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${pedidoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  ref={id_PedidoRef}
                  name="id_Pedido"
                  value={formState.id_Pedido}
                  onChange={handlePedidosChange}
                >
                  <option value="">Seleccionar</option>
                  {pedidosDisponiblesCombo.map((pedido) => (
                    <option key={pedido.id_Pedido} value={pedido.id_Pedido}>
                      {pedido.de_Pedido}
                    </option>
                  ))}
                </CustomSelect> */}
                <CustomMultiSelect
                  className={`mt-2 mb-2 text-black focus:${pedidoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  options={arregloComboPedidos}
                  value={
                    Array.isArray(formState.id_Pedido)
                      ? formState.id_Pedido
                      : []
                  } // Asegura que el valor se controle por el estado
                  onChange={(newValue) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      id_Pedido: newValue as unknown as number,
                    }));
                  }}
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Domicilio</Label>
                <CustomInput
                  color={`${domicilioValido ? '' : 'failure'}`}
                  onBlur={() => setCorreoValido(true)}
                  disabled={sn_Visualizar}
                  ref={de_DomicilioRef}
                  placeholder="Ingrese un domicilio"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_Domicilio"
                  name="de_Domicilio"
                  value={formState.de_Domicilio}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${domicilioValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
            </FormControl>
            <FormControl className="grid grid-cols-1 md:grid-cols-3 gap-[2rem] mb-[1rem]">
              <div className="w-full">
                <Label className="text-[1.6rem]">Teléfono Celular</Label>
                <CustomInput
                  color={`${telefonoValido ? '' : 'failure'}`}
                  onBlur={() => setTelefonoValido(true)}
                  disabled={sn_Visualizar}
                  ref={nu_TelefonoRef}
                  placeholder="Teléfono de Celular"
                  required
                  type="number"
                  id="nu_Telefono"
                  name="nu_Telefono"
                  value={formState.nu_Telefono}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${telefonoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Correo Electronico</Label>
                <CustomInput
                  color={`${correoValido ? '' : 'failure'}`}
                  onBlur={() => setCorreoValido(true)}
                  disabled={sn_Visualizar}
                  ref={de_CorreoElectronicoRef}
                  placeholder="Ingrese un correo electronico"
                  required
                  type="text"
                  id="de_CorreoElectronico"
                  name="de_CorreoElectronico"
                  value={formState.de_CorreoElectronico}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${correoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">RFC</Label>
                <CustomInput
                  color={`${RFCValido ? '' : 'failure'}`}
                  onBlur={() => setRFCValido(true)}
                  disabled={sn_Visualizar}
                  ref={de_RFCRef}
                  placeholder="Ingrese un RFC"
                  required
                  type="text"
                  autoComplete="off"
                  id="de_RFC"
                  name="de_RFC"
                  value={formState.de_RFC}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${RFCValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
            </FormControl>
            <FormControl className="grid grid-cols-1 md:grid-cols-3 gap-[2rem] mb-[1rem]">
              <div className="w-full">
                <Label className="text-[1.6rem]">Regimen</Label>
                <CustomInput
                  color={`${regimenValido ? '' : 'failure'}`}
                  onBlur={() => setTelefonoValido(true)}
                  disabled={sn_Visualizar}
                  ref={de_RegimenRef}
                  placeholder="Ingrese un regimen"
                  required
                  type="text"
                  id="de_Regimen"
                  name="de_Regimen"
                  value={formState.de_Regimen}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${regimenValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full">
                <Label className="text-[1.6rem]">Uso</Label>
                <CustomInput
                  color={`${usoValido ? '' : 'failure'}`}
                  onBlur={() => setCorreoValido(true)}
                  disabled={sn_Visualizar}
                  ref={de_UsoRef}
                  placeholder="Escriba un uso"
                  required
                  type="text"
                  id="de_Uso"
                  name="de_Uso"
                  value={formState.de_Uso}
                  onChange={onInputChange}
                  className={`mb-2 w-full rounded-lg py-2 focus:outline-none focus:ring-1 focus:${usoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                  style={{ fontSize: '1.4rem' }}
                  sizing="lg"
                />
              </div>
              <div className="w-full mt-2">
                <Label className="text-[1.6rem]">Constancia Fiscal</Label>
                <CustomSelect
                  disabled={sn_Visualizar}
                  value={
                    formState.sn_ConstanciaFiscal === null
                      ? ''
                      : formState.sn_ConstanciaFiscal
                        ? '1'
                        : '0'
                  }
                  className="dark:text-white"
                  name="sn_ConstanciaFiscal"
                  onChange={onInputChange}
                  style={{ fontSize: '1.4rem' }}
                >
                  <option className="dark:text-black" value="">
                    Seleccionar
                  </option>
                  <option className="dark:text-black" value="1">
                    Si
                  </option>
                  <option className="dark:text-black" value="0">
                    No
                  </option>
                </CustomSelect>
              </div>
            </FormControl>

            <FormControl className="grid grid-cols-1 md:grid-cols-3 gap-[2rem]">
              <div className={`w-full ${sn_Editar ? '' : 'hidden'}`}>
                <Label className="text-[1.6rem]">Estatus</Label>
                <CustomSelect
                  value={
                    formState.sn_Activo === null
                      ? ''
                      : formState.sn_Activo
                        ? '1'
                        : '0'
                  }
                  className="dark:text-white"
                  name="sn_Activo"
                  onChange={onInputChange}
                  style={{ fontSize: '1.4rem' }}
                >
                  <option className="dark:text-black" value="">
                    Todos
                  </option>
                  <option className="dark:text-black" value="1">
                    Activo
                  </option>
                  <option className="dark:text-black" value="0">
                    Inactivo
                  </option>
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
        onConfirm={guardarFactura}
        objeto="Factura"
        sn_editar={sn_Editar}
      />
    </>
  );
};
