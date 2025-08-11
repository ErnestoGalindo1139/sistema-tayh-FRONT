import React, { useEffect, useState } from 'react';
import { DataTable } from '../components/DataTable';
import Toast from '../components/Toast';
import { EditIcon } from '../icons/EditIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { AddIcon } from '../icons/AddIcon';
import { useDisclosure } from '@chakra-ui/react';
import { useTheme } from '../../ThemeContext';
import { IApiError } from '../interfaces/interfacesApi';
import { WaitScreen } from '../components/WaitScreen';
import { getClientesComboMultiSelect } from '../helpers/apiClientes';
import { RetweetIcon } from '../icons/RetweetIcon';
import { Tooltip, Label, Datepicker } from 'flowbite-react';
import { SearchIcon } from '../icons/SearchIcon';
import { useForm } from '../hooks/useForm';
import { CustomInput } from '../components/custom/CustomInput';
import { CustomMultiSelect } from '../components/custom/CustomMultiSelect';
import { ModalCancelacionEstatus } from '../dialogs/ModalCancelacionEstatus';
import { CustomSelect } from '../components/custom/CustomSelect';
import { IEstatus } from '../interfaces/interfacesEstatus';
import { getEstatus } from '../helpers/apiEstatus';
import { columns } from '../data/facturacion/facturacionData';
import { CustomSelectValue } from '../interfaces/interfacesGlobales';
import {
  IFacturacion,
  IFiltrosFacturacion,
  IFormFacturacion,
} from '../interfaces/interfacesFacturacion';
import { getFacturas } from '../helpers/facturacion/apiFacturacion';
import { buscarFacturasHelper } from '../helpers/facturacion/buscarFacturasHelper';
import { ModalFacturacion } from '../dialogs/Facturacion/ModalFacturacion';
import { eliminarFacturaHelper } from '../helpers/facturacion/eliminarFacturaHelper';
import { FacturasExcel } from '../excel/FacturasExcel';
import { useFormDate } from '../hooks/useFormDate';
import { customDatePickerTheme } from '../themes/customDatePickerTheme';
import { getFinMesActual, getInicioMesActual } from '../utils/fechas';

export const FacturacionAdmin = (): React.JSX.Element => {
  const [facturas, setFacturas] = useState<IFacturacion[]>([]);
  const [factura, setFactura] = useState<IFacturacion>();

  const { formState, setFormState, onInputChange, onResetForm } =
    useForm<IFiltrosFacturacion>({
      id_Factura: '',
      id_Pedido: '',
      id_Cliente: '',
      clientes: '',
      de_Domicilio: '',
      nu_Telefono: '',
      de_CorreoElectronico: '',
      de_RFC: '',
      de_Regimen: '',
      de_Uso: '',
      sn_ConstanciaFiscal: null,
      sn_Activo: null,
      fh_Inicio: getInicioMesActual(),
      fh_Fin: getFinMesActual(),
    });

  const [sn_Editar, setSn_Editar] = useState<boolean>(false);
  const [sn_Visualizar, setSn_Visualizar] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [clientesCombo, setClientesCombo] = useState<CustomSelectValue[]>([]);
  const [estatusEnvios, setEstatusEnvios] = useState<IEstatus[]>([]);
  const [estatusEnviosFormulario, setEstatusEnviosFormulario] = useState<
    IEstatus[]
  >([]);

  const { isDarkMode } = useTheme();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onOpen: openConfirm,
    onClose: closeConfirm,
  } = useDisclosure();

  useEffect(() => {
    const fetchEnvios = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const facturasData = await getFacturas(formState);
        setFacturas(facturasData.body);
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

    const fetchClientesCombo = async (): Promise<void> => {
      try {
        const arregloCombo = await getClientesComboMultiSelect();
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
        setEstatusEnviosFormulario(estatusData.body);
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

  const actions = [
    {
      icono: <EyeIcon className="text-blue-500" />,
      texto: 'Visualizar',
      onClick: (row: IFacturacion): void => {
        setSn_Editar(false);
        setSn_Visualizar(true);
        onResetForm();
        openModal();
        setFactura({
          ...row,
        });
      },
      width: '8%',
    },
    {
      icono: <EditIcon className="text-green-500" />,
      texto: 'Editar',
      onClick: (row: IFacturacion): void => {
        setSn_Editar(true);
        setSn_Visualizar(false);
        onResetForm();
        openModal();
        setFactura({
          ...row,
        });
      },
    },
    {
      icono: <RetweetIcon className="text-black" />,
      texto: 'Activar / Inactivar',
      onClick: (row: IFacturacion): void => {
        setSn_Editar(false);
        setSn_Visualizar(false);
        setFactura({ ...row });
        openConfirm();
      },
    },
  ];

  const buscarFacturas = async (
    filtros: IFiltrosFacturacion
  ): Promise<void> => {
    setIsLoading(true);

    if (
      !formState.fh_Inicio ||
      formState.fh_Inicio == '' ||
      !formState.fh_Fin ||
      formState.fh_Fin == ''
    ) {
      Toast.fire({
        icon: 'info',
        title: 'Ocurrió un Error',
        text: 'La fecha inicio y la fecha fin no pueden estar vacias',
      });
      setIsLoading(false);
      return;
    }

    // Asegúrate de convertir a Date si es necesario
    const fechaInicio = new Date(formState.fh_Inicio);
    const fechaFin = new Date(formState.fh_Fin);

    if (fechaInicio > fechaFin) {
      Toast.fire({
        icon: 'info',
        title: 'Ocurrió un Error',
        text: 'La fecha inicio no puede ser mayor a la fecha fin',
      });

      setIsLoading(false);

      return;
    }

    if (fechaInicio > fechaFin) {
      Toast.fire({
        icon: 'info',
        title: 'Ocurrió un Error',
        text: 'La fecha inicio no puede ser mayor a la fecha fin',
      });

      setIsLoading(false);

      return;
    }

    const clientes = Array.isArray(filtros.id_Cliente)
      ? filtros.id_Cliente
          .map((cliente: { value: unknown }) => cliente.value)
          .toString()
      : '';

    filtros.clientes = clientes;

    const facturasData = await buscarFacturasHelper(filtros);

    if (facturasData.success) {
      setFacturas(facturasData.body);
      setIsLoading(false);
    } else {
      setFacturas([]);
      setIsLoading(false);
      return;
    }
  };

  const eliminarFactura = async (envio: IFormFacturacion): Promise<void> => {
    setIsLoading(true);
    const facturasData = await eliminarFacturaHelper(
      envio.id_Factura,
      formState
    );

    if (facturasData.success) {
      setFacturas(facturasData.body);
      setIsLoading(false);
      closeConfirm();
    } else {
      setFacturas([]);
      setIsLoading(false);
      return;
    }
  };

  const { handleDateChange, getDateForPicker } = useFormDate(
    formState,
    setFormState
  );

  return (
    <>
      {isLoading && <WaitScreen message="cargando..." />}
      <div className={isDarkMode ? 'dark' : ''}>
        <section className="content dark:bg-[#020405]">
          {/* contenedor */}
          <div className="flex items-center justify-between">
            <div className="dark:text-white">
              <h2 className="font-bold text-[2.5rem]">Facturacion</h2>
              <p className="text-[1.6rem]">
                Aquí puedes gestionar las Facturas.
              </p>
            </div>

            <div className="flex gap-2">
              <FacturasExcel filtros={formState} />

              <Tooltip
                content="Agregar Factura"
                className="text-[1.3rem]"
                placement="bottom"
              >
                <button
                  onClick={() => {
                    setSn_Editar(false);
                    setSn_Visualizar(false);
                    onResetForm();
                    openModal();
                  }}
                >
                  <AddIcon width="4em" height="4em" />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Filtros */}
          <div className="filtros">
            <fieldset className="filtros-fieldset dark:bg-[#020405]">
              <legend className="filtros-legend dark:text-white">
                &nbsp;&nbsp;Filtros&nbsp;&nbsp;
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-[2.5rem]">
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Folio Factura
                  </Label>
                  <CustomInput
                    type="number"
                    placeholder="Ingrese un folio de factura"
                    className="text-[1.4rem]"
                    name="id_Factura"
                    id="id_Factura"
                    value={formState.id_Factura}
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Folio Pedido
                  </Label>
                  <CustomInput
                    type="number"
                    placeholder="Ingrese un folio de pedido"
                    className="text-[1.4rem]"
                    name="id_Pedido"
                    id="id_Pedido"
                    value={formState.id_Pedido}
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div className="dark:text-white">
                  <Label className="text-[1.6rem]">RFC</Label>
                  <CustomInput
                    type="text"
                    placeholder="Ingrese un RFC"
                    className=""
                    id="de_RFC"
                    name="de_RFC"
                    value={formState.de_RFC}
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Estatus
                  </Label>
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-[2.5rem] mt-[1rem]">
                <div className="dark:text-white">
                  <Label className="text-[1.6rem]">Régimen</Label>
                  <CustomInput
                    type="text"
                    placeholder="Escribe un régimen"
                    className=""
                    id="de_Regimen"
                    name="de_Regimen"
                    value={formState.de_Regimen}
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div className="dark:text-white">
                  <Label className="text-[1.6rem]">Cliente</Label>
                  <CustomMultiSelect
                    options={clientesCombo}
                    onChange={(newValue) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        id_Cliente: newValue as unknown as string,
                      }));
                    }}
                  />
                </div>
                <div className="dark:text-white">
                  <Label className="text-[1.6rem]">Domicilio</Label>
                  <CustomInput
                    type="text"
                    placeholder="Escribe un domicilio"
                    className=""
                    id="de_Domicilio"
                    name="de_Domicilio"
                    value={formState.de_Domicilio}
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Constancia Fiscal
                  </Label>
                  <CustomSelect
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-[2.5rem] mt-[1rem]">
                <div>
                  <label className="text-[1.6rem] font-bold">
                    Fecha Inicio
                  </label>
                  <Datepicker
                    placeholder="Fecha Inicio"
                    id="fh_Inicio"
                    name="fh_Inicio"
                    value={getDateForPicker(formState.fh_Inicio || '')} // Convertimos el string a Date ajustado a UTC
                    onChange={(date) => {
                      handleDateChange(date, 'fh_Inicio');
                    }}
                    className={`w-full rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
                    language="es-MX"
                    style={{ fontSize: '1.4rem', height: '3.7rem' }}
                    theme={customDatePickerTheme}
                    autoHide={false}
                    key={formState.fh_Inicio || 'fh_Inicio'} // Cambia la clave cuando el valor cambia
                  />
                </div>
                <div>
                  <label className="text-[1.6rem] font-bold">Fecha Fin</label>
                  <Datepicker
                    placeholder="Fecha Fin"
                    id="fh_Fin"
                    name="fh_Fin"
                    value={getDateForPicker(formState.fh_Fin || '')} // Convertimos el string a Date ajustado a UTC
                    onChange={(date) => {
                      handleDateChange(date, 'fh_Fin');
                    }}
                    className={`w-full rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
                    language="es-MX"
                    style={{ fontSize: '1.4rem', height: '3.7rem' }}
                    theme={customDatePickerTheme}
                    autoHide={false}
                    key={formState.fh_Fin || 'fh_Fin'} // Cambia la clave cuando el valor cambia
                  />
                </div>
              </div>
              <div className="flex justify-end mt-[2rem] cursor-pointer">
                <Tooltip
                  content="Buscar"
                  className="text-[1.3rem]"
                  placement="bottom"
                >
                  <SearchIcon
                    className="text-[#1769d8] text-[1.8rem]"
                    onClick={() => buscarFacturas(formState)}
                  />
                </Tooltip>
              </div>
            </fieldset>
          </div>

          <div className="table-container dark:bg-transparent">
            <DataTable data={facturas} columns={columns} actions={actions} />
          </div>

          <ModalFacturacion
            isOpen={isModalOpen}
            onClose={closeModal}
            actualizarFacturas={setFacturas}
            row={
              factura
                ? factura
                : {
                    id_Factura: 0,
                    id_Pedido: 0,
                    id_Cliente: 0,
                    de_Domicilio: '',
                    nu_Telefono: '',
                    de_CorreoElectronico: '',
                    de_RFC: '',
                    de_Regimen: '',
                    de_Uso: '',
                    sn_ConstanciaFiscal: null,
                    sn_Activo: null,
                  }
            }
            sn_Editar={sn_Editar}
            sn_Visualizar={sn_Visualizar}
          />

          <ModalCancelacionEstatus
            isOpen={isConfirmOpen}
            onClose={closeConfirm}
            onConfirm={() => {
              if (factura) {
                eliminarFactura({
                  ...factura,
                  id_Factura: Number(factura.id_Factura),
                });
              }
            }}
            descripcion={`La Factura #${factura?.id_Factura} del Cliente: ${factura?.nb_Cliente}`}
            objeto="Envio"
            estatusActivo={factura?.sn_Activo === true}
          />
        </section>
      </div>
    </>
  );
};
