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
import { getClientesCombo } from '../helpers/apiClientes';
import { RetweetIcon } from '../icons/RetweetIcon';
import { Tooltip, Label, Datepicker } from 'flowbite-react';
import { SearchIcon } from '../icons/SearchIcon';
import {
  IEnvios,
  IFiltrosEnvios,
  IFormEnvios,
} from '../interfaces/interfacesEnvios';
import { getEnvios } from '../helpers/apiEnvios';
import { ModalEnvios } from '../dialogs/ModalEnvios';
import { useForm } from '../hooks/useForm';
import { CustomInput } from '../components/custom/CustomInput';
import { IClientesCombo } from '../interfaces/interfacesClientes';
import { CustomMultiSelect } from '../components/custom/CustomMultiSelect';
import { buscarEnviosHelper } from '../helpers/envios/buscarEnviosHelper';
import { ModalCancelacionEstatus } from '../dialogs/ModalCancelacionEstatus';
import { eliminarEnvioHelper } from '../helpers/envios/eliminarEnvioHelper';
import { CustomSelect } from '../components/custom/CustomSelect';
import { IEstatus } from '../interfaces/interfacesEstatus';
import { getEstatus } from '../helpers/apiEstatus';
import { EnviosExcel } from '../excel/EnviosExcel';
import { useFormDate } from '../hooks/useFormDate';
import { customDatePickerTheme } from '../themes/customDatePickerTheme';
import { getFinMesActual, getInicioMesActual } from '../utils/fechas';

export const EnviosAdmin = (): React.JSX.Element => {
  const [envios, setEnvios] = useState<IEnvios[]>([]);
  const [envio, setEnvio] = useState<IEnvios>();

  const { formState, setFormState, onInputChange, onResetForm } = useForm({
    id_Envio: '',
    id_Cliente: '',
    clientes: '',
    de_Direccion: '',
    de_CorreoElectronico: '',
    nu_TelefonoCelular: '',
    nu_TelefonoRedLocal: '',
    de_FolioGuia: '',
    id_Estatus: '',
    fh_Inicio: getInicioMesActual(),
    fh_Fin: getFinMesActual(),
  });

  const [sn_Editar, setSn_Editar] = useState<boolean>(false);
  const [sn_Visualizar, setSn_Visualizar] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [clientesCombo, setClientesCombo] = useState<IClientesCombo[]>([]);
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
        const enviosData = await getEnvios(formState);
        setEnvios(enviosData.body);
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

  const columns: {
    id: keyof IEnvios;
    texto: string;
    visible: boolean;
    width: string;
    bgColor?: string;
    textAlign?: string;
  }[] = [
    { id: 'id_Envio', texto: 'Folio Envio', visible: true, width: '5%' },
    {
      id: 'nb_Cliente',
      texto: 'Cliente',
      visible: true,
      width: '',
    },
    {
      id: 'de_Direccion',
      texto: 'Dirección',
      visible: true,
      width: '',
    },
    {
      id: 'de_CorreoElectronico',
      texto: 'Correo Electrónico',
      visible: true,
      width: '',
    },
    {
      id: 'nu_TelefonoCelular',
      texto: 'Teléfono Celular',
      visible: true,
      width: '',
    },
    {
      id: 'nu_TelefonoRedLocal',
      texto: 'Teléfono Red Local',
      visible: true,
      width: '',
    },
    {
      id: 'de_FolioGuia',
      texto: 'Folio Guia',
      visible: true,
      width: '',
    },
    {
      id: 'de_Estatus',
      texto: 'Estatus',
      bgColor: 'color_Estatus',
      textAlign: 'center',
      visible: true,
      width: '10%',
    },
  ];

  const actions = [
    {
      icono: <EyeIcon className="text-blue-500" />,
      texto: 'Visualizar',
      onClick: (row: IEnvios): void => {
        setSn_Editar(false);
        setSn_Visualizar(true);
        onResetForm();
        openModal();
        setEnvio({
          ...row,
        });
      },
      width: '8%',
    },
    {
      icono: <EditIcon className="text-green-500" />,
      texto: 'Editar',
      onClick: (row: IEnvios): void => {
        setSn_Editar(true);
        setSn_Visualizar(false);
        onResetForm();
        openModal();
        setEnvio({
          ...row,
        });
      },
    },
    {
      icono: <RetweetIcon className="text-black" />,
      texto: 'Activar / Inactivar',
      onClick: (row: IEnvios): void => {
        setSn_Editar(false);
        setSn_Visualizar(false);
        setEnvio({ ...row });
        openConfirm();
      },
    },
  ];

  const arregloComboClientes = clientesCombo.map((cliente) => {
    // Asegurarse de que `id_Cliente` sea siempre un número, o un string si lo prefieres
    const value = cliente.id_Cliente ?? 0; // Asigna 0 si `id_Cliente` es `undefined`
    return {
      value:
        typeof value === 'number' || !isNaN(Number(value)) ? Number(value) : 0, // Asegúrate de convertir el valor a un número si es posible
      label: cliente.nb_Cliente || 'Cliente desconocido', // Asegúrate de que `label` siempre tenga un valor
    };
  });

  const buscarEnvios = async (filtros: IFiltrosEnvios): Promise<void> => {
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

    const clientes = Array.isArray(filtros.id_Cliente)
      ? filtros.id_Cliente
          .map((cliente: { value: unknown }) => cliente.value)
          .toString()
      : '';

    filtros.clientes = clientes;

    const enviosData = await buscarEnviosHelper(filtros);

    if (enviosData.success) {
      setEnvios(enviosData.body);
      setIsLoading(false);
    } else {
      setEnvios([]);
      setIsLoading(false);
      return;
    }
  };

  const eliminarEnvio = async (envio: IFormEnvios): Promise<void> => {
    setIsLoading(true);
    const enviosData = await eliminarEnvioHelper(
      envio.id_Cliente,
      envio.id_Envio,
      envio.id_Estatus,
      formState
    );

    if (enviosData.success) {
      setEnvios(enviosData.body);
      setIsLoading(false);
      closeConfirm();
    } else {
      setEnvios([]);
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
              <h2 className="font-bold text-[2.5rem]">Envíos</h2>
              <p className="text-[1.6rem]">Aquí puedes gestionar los Envíos.</p>
            </div>
            <div className="flex gap-2">
              <EnviosExcel filtros={formState} />

              <Tooltip
                content="Agregar Envío"
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-[2.5rem]">
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Folio Envio
                  </Label>
                  <CustomInput
                    type="number"
                    placeholder="Ingrese un folio"
                    className="text-[1.4rem]"
                    name="id_Envio"
                    id="id_Envio"
                    value={formState.id_Envio}
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div className="dark:text-white">
                  <Label className="text-[1.6rem]">Cliente</Label>
                  <CustomMultiSelect
                    options={arregloComboClientes}
                    onChange={(newValue) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        id_Cliente: newValue as unknown as string,
                      }));
                    }}
                  />
                </div>
                <div className="dark:text-white">
                  <Label className="text-[1.6rem]">Dirección</Label>
                  <CustomInput
                    type="text"
                    placeholder="Escribe su dirección"
                    className=""
                    id="de_Direccion"
                    value={formState.de_Direccion}
                    name="de_Direccion"
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-[2.5rem] mt-[1rem]">
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Teléfono de Red Local
                  </Label>
                  <CustomInput
                    type="number"
                    placeholder="Ej. 6692884736"
                    className="text-[1.4rem]"
                    id="nu_TelefonoRedLocal"
                    value={formState.nu_TelefonoRedLocal}
                    name="nu_TelefonoRedLocal"
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Teléfono Celular
                  </Label>
                  <CustomInput
                    type="number"
                    placeholder="Ej. 6692884736"
                    className="text-[1.4rem]"
                    id="nu_TelefonoCelular"
                    value={formState.nu_TelefonoCelular}
                    name="nu_TelefonoCelular"
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Correo Electronico
                  </Label>
                  <CustomInput
                    type="text"
                    placeholder="Escriba un correo electronico"
                    className="text-[1.4rem]"
                    id="de_CorreoElectronico"
                    value={formState.de_CorreoElectronico}
                    name="de_CorreoElectronico"
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-[2.5rem] mt-[1rem]">
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Estatus
                  </Label>
                  <CustomSelect
                    className="id_Estatus"
                    value={formState.id_Estatus}
                    name="id_Estatus"
                    onChange={onInputChange}
                    style={{ fontSize: '1.4rem' }}
                  >
                    <option value="">Seleccionar</option>
                    {estatusEnvios.map((estatus) => (
                      <option
                        key={estatus.id_Estatus}
                        value={estatus.id_Estatus}
                      >
                        {estatus.de_Estatus}
                      </option>
                    ))}
                  </CustomSelect>
                </div>
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
                    autoHide={true}
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
                    autoHide={true}
                    key={formState.fh_Inicio || 'fh_Fin'} // Cambia la clave cuando el valor cambia
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
                    onClick={() => buscarEnvios(formState)}
                  />
                </Tooltip>
              </div>
            </fieldset>
          </div>

          <div className="table-container dark:bg-transparent">
            <DataTable data={envios} columns={columns} actions={actions} />
          </div>

          <ModalEnvios
            isOpen={isModalOpen}
            onClose={closeModal}
            actualizarEnvios={setEnvios}
            row={
              envio
                ? envio
                : {
                    id_Envio: 0,
                    id_Cliente: '',
                    de_Direccion: '',
                    de_CorreoElectronico: '',
                    nu_TelefonoCelular: '',
                    nu_TelefonoRedLocal: '',
                    de_FolioGuia: '',
                    id_Estatus: 0,
                    id_Pedido: 0,
                  }
            }
            sn_Editar={sn_Editar}
            sn_Visualizar={sn_Visualizar}
          />

          <ModalCancelacionEstatus
            isOpen={isConfirmOpen}
            onClose={closeConfirm}
            onConfirm={() => {
              if (envio) {
                eliminarEnvio({
                  ...envio,
                  id_Cliente: Number(envio.id_Cliente),
                });
              }
            }}
            descripcion={`El Envio #${envio?.id_Envio} del Cliente: ${envio?.nb_Cliente}`}
            objeto="Envio"
            estatusActivo={envio?.id_Estatus != 5 ? true : false}
          />
        </section>
      </div>
    </>
  );
};
