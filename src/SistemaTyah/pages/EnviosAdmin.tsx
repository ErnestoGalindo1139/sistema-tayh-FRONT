import React, { useEffect, useState } from 'react';
import { DataTable } from '../components/DataTable';
import Toast from '../components/Toast';
import { EditIcon } from '../icons/EditIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { AddIcon } from '../icons/AddIcon';
import { useDisclosure } from '@chakra-ui/react';
import { useTheme } from '../../ThemeContext';
import { ApiResponse, IApiError } from '../interfaces/interfacesApi';
import { WaitScreen } from '../components/WaitScreen';
import { deleteClientes, getClientes, getClientesCombo } from '../helpers/apiClientes';
import { ModalClientes } from '../dialogs/ModalClientes';
import { ModalConfirmacion } from '../dialogs/ModalConfirmacion';
import { RetweetIcon } from '../icons/RetweetIcon';
import { Tooltip, Label, Select } from 'flowbite-react';
import { SearchIcon } from '../icons/SearchIcon';
import { IEnvios, IFiltrosEnvios } from '../interfaces/interfacesEnvios';
import { getEnvios } from '../helpers/apiEnvios';
import { ModalEnvios } from '../dialogs/ModalEnvios';
import { useForm } from '../hooks/useForm';
import { CustomInput } from '../components/custom/CustomInput';
import { IClientesCombo } from '../interfaces/interfacesClientes';
import { CustomSelect } from '../components/custom/CustomSelect';

export const EnviosAdmin = (): React.JSX.Element => {
  const [envios, setEnvios] = useState<IEnvios[]>([]);
  const [envio, setEnvio] = useState<IEnvios>();

  const [filtros, setFiltros] = useState<IFiltrosEnvios>({
    id_Envio: '',
    nb_Destinatario: '',
    de_Direccion: '',
    de_CorreoElectronico: '',
    nu_TelefonoCelular: '',
    nu_TelefonoRedLocal: '',
    de_FolioGuia: '',
  });

  const { formState, setFormState, onInputChange, onResetForm } = useForm({
    id_Envio: '',
    id_Cliente: '',
    nb_Destinatario: '',
    de_Direccion: '',
    de_CorreoElectronico: '',
    nu_TelefonoCelular: '',
    nu_TelefonoRedLocal: '',
    de_FolioGuia: '',
  });

  const [sn_Editar, setSn_Editar] = useState<boolean>(false);
  const [sn_Visualizar, setSn_Visualizar] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [clientesCombo, setClientesCombo] = useState<IClientesCombo[]>([]);

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
        const arregloCombo = await getClientesCombo({ sn_Activo: true });
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

  const columns: {
    id: keyof IEnvios;
    texto: string;
    visible: boolean;
    width: string;
  }[] = [
    { id: 'id_Envio', texto: 'Envio', visible: true, width: '5%' },
    {
      id: 'id_Cliente',
      texto: 'Cliente',
      visible: true,
      width: '5%',
    },
    {
      id: 'nb_Destinatario',
      texto: 'Destinatario',
      visible: true,
      width: '30%',
    },
    {
      id: 'de_Direccion',
      texto: 'Direccion',
      visible: true,
      width: '',
    },
    {
      id: 'de_CorreoElectronico',
      texto: 'CorreoElectronico',
      visible: false,
      width: '',
    },
    {
      id: 'nu_TelefonoCelular',
      texto: 'TelefonoCelular',
      visible: false,
      width: '',
    },
  ];

  const actions = [
    {
      icono: <EyeIcon className="text-blue-500" />,
      texto: 'Visualizar',
      onClick: (row: IEnvios): void => {
        setSn_Editar(false);
        setSn_Visualizar(true);
        limpiarCliente();
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
        limpiarCliente();
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

  const limpiarCliente = (): void => {
    setEnvio({
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

  return (
    <>
      {isLoading && <WaitScreen message="cargando..." />}
      <div className={isDarkMode ? 'dark' : ''}>
        <section className="content dark:bg-[#020405]">
          {/* contenedor */}
          <div className="flex items-center justify-between">
            <div className="dark:text-white">
              <h2 className="font-bold text-[2.5rem]">Envios</h2>
              <p className="text-[1.6rem]">Aquí puedes gestionar los Envios.</p>
            </div>

            <Tooltip
              content="Agregar Envio"
              className="text-[1.3rem]"
              placement="bottom"
            >
              <button
                onClick={() => {
                  setSn_Editar(false);
                  setSn_Visualizar(false);
                  limpiarCliente();
                  openModal();
                }}
              >
                <AddIcon width="4em" height="4em" />
              </button>
            </Tooltip>
          </div>

          {/* Filtros */}
          <div className="filtros">
            <fieldset className="filtros-fieldset dark:bg-[#020405]">
              <legend className="filtros-legend dark:text-white">
                &nbsp;&nbsp;Filtros&nbsp;&nbsp;
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-y-4 gap-x-[2.5rem]">
                <div className="dark:text-white">
                  <Label className="text-[1.6rem]">Cliente</Label>
                  <CustomSelect>
                    <option value="">Seleccionar</option>
                    {clientesCombo.map((cliente) => (
                      <option
                        key={cliente.id_Cliente}
                        value={cliente.id_Cliente}
                      >
                        {cliente.nb_Cliente}
                      </option>
                    ))}
                  </CustomSelect>
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
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Telefono de Red Local
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
                    Telefono Celular
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
              </div>

              <div className="flex justify-end mt-[2rem] cursor-pointer">
                <Tooltip
                  content="Buscar"
                  className="text-[1.3rem]"
                  placement="bottom"
                >
                  <SearchIcon className="text-[#1769d8] text-[1.8rem]" />
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
                    id_Cliente: 0,
                    nb_Destinatario: '',
                    de_Direccion: '',
                    de_CorreoElectronico: '',
                    nu_TelefonoCelular: '',
                    nu_TelefonoRedLocal: '',
                    de_FolioGuia: '',
                  }
            }
            sn_Editar={sn_Editar}
            sn_Visualizar={sn_Visualizar}
          />

          {/* <ModalConfirmacion
            isOpen={isConfirmOpen}
            onClose={closeConfirm}
            // onConfirm={() => eliminarCliente(envio?.id_Cliente || '')}
            descripcion={envio?.nb_Destinatario || ''}
            objeto="Cliente"
            activo={envio?.sn_Activo || false}
          /> */}
        </section>
      </div>
    </>
  );
};
