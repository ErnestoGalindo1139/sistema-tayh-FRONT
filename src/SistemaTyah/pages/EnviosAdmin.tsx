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
import { deleteClientes, getClientes } from '../helpers/apiClientes';
import { ModalClientes } from '../dialogs/ModalClientes';
import { ModalConfirmacion } from '../dialogs/ModalConfirmacion';
import { RetweetIcon } from '../icons/RetweetIcon';
import { Tooltip, Label, TextInput } from 'flowbite-react';
import { SearchIcon } from '../icons/SearchIcon';
import { IEnvios, IFiltrosEnvios } from '../interfaces/interfacesEnvios';
import { getEnvios } from '../helpers/apiEnvios';

export const EnviosAdmin = (): React.JSX.Element => {
  const [envios, setEnvios] = useState<IEnvios[]>([]);
  const [envio, setEnvio] = useState<IEnvios>();

  const [filtros, setFiltros] = useState<IFiltrosEnvios>({
    id_Envio: '',
    nb_Destinatario: '',
    de_Direccion: '',
    de_CorreoElectronico: '',
    nu_TelefonoCelular: '',
    de_FolioGuia: '',
  });

  const [sn_Editar, setSn_Editar] = useState<boolean>(false);
  const [sn_Visualizar, setSn_Visualizar] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

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
        const enviosData = await getEnvios(filtros);
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

    fetchEnvios();
  }, []);

  const columns: {
    id: keyof IEnvios;
    texto: string;
    visible: boolean;
  }[] = [
    { id: 'id_Envio', texto: 'Envio', visible: true },
    { id: 'id_Cliente', texto: 'Cliente', visible: true },
    { id: 'nb_Destinatario', texto: 'Destinatario', visible: true },
    { id: 'de_Direccion', texto: 'Direccion', visible: true },
    {
      id: 'de_CorreoElectronico',
      texto: 'CorreoElectronico',
      visible: false,
    },
    { id: 'nu_TelefonoCelular', texto: 'TelefonoCelular', visible: false },
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
      id_Envio: '',
      id_Cliente: '',
      nb_Destinatario: '',
      de_Direccion: '',
      de_CorreoElectronico: '',
      nu_TelefonoCelular: '',
      de_FolioGuia: '',
    });
  };

  setIsLoading(true);
  const eliminarCliente = async (id_Cliente: string): Promise<void> => {
    const payload = {
      id_Cliente,
    };

    setIsLoading(true);

    try {
      const response = await deleteClientes(payload);

      if (!response.success) {
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: response.message,
        });
        return;
      }

      Toast.fire({
        icon: 'success',
        title: 'Operación exitosa',
        text: response.message,
      });

      // Actualizar los clientes
      const enviosData = await getEnvios(filtros);
      setEnvios(enviosData.body);
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
      closeConfirm();
    }
  };
  setIsLoading(false);

  const buscarClientes = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const enviosData = await getEnvios(filtros);
      setEnvios(enviosData.body);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Toast.fire({
        icon: 'error',
        title: 'Ocurrió un Error',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* {isLoading && <WaitScreen message="cargando..." />} */}
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
                  <Label className="text-[1.6rem]">Destinatario</Label>
                  <TextInput
                    type="text"
                    placeholder="Nombre del cliente"
                    className="dark:text-white text-[1.4rem]"
                    value={filtros.nb_Destinatario}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        nb_Destinatario: e.target.value,
                      })
                    }
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div className="dark:text-white">
                  <Label className="text-[1.6rem]">Dirección</Label>
                  <TextInput
                    type="text"
                    placeholder="Escribe su dirección"
                    className="dark:text-white"
                    value={filtros.de_Direccion}
                    onChange={(e) =>
                      setFiltros({ ...filtros, de_Direccion: e.target.value })
                    }
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Correo Electronico
                  </Label>
                  <TextInput
                    type="text"
                    placeholder="Escriba un correo electronico"
                    className="dark:text-white text-[1.4rem]"
                    value={filtros.de_CorreoElectronico}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        de_CorreoElectronico: e.target.value,
                      })
                    }
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Telefono de Red Local
                  </Label>
                  <TextInput
                    type="number"
                    placeholder="Ej. 6692884736"
                    className="dark:text-white text-[1.4rem]"
                    value={filtros.nu_TelefonoCelular}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        nu_TelefonoCelular: e.target.value,
                      })
                    }
                    style={{ fontSize: '1.4rem' }}
                    sizing="lg"
                  />
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white">
                    Telefono Celular
                  </Label>
                  <TextInput
                    type="number"
                    placeholder="Ej. 6692884736"
                    className="dark:text-white text-[1.4rem]"
                    value={filtros.nu_TelefonoCelular}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        nu_TelefonoCelular: e.target.value,
                      })
                    }
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

          {/* <ModalClientes 
            isOpen={isModalOpen}
            onClose={closeModal}
            actualizarClientes={setEnvios}
            row={
              envio
                ? envio
                : {
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
                  }
            }
            sn_Editar={sn_Editar}
            sn_Visualizar={sn_Visualizar}
          /> */}

          {/* <ModalConfirmacion 
            isOpen={isConfirmOpen}
            onClose={closeConfirm}
            onConfirm={() => eliminarCliente(envio?.id_Cliente || '')}
            descripcion={envio?.nb_Cliente || ''}
            objeto="Cliente"
            // activo={envio?.sn_Activo || false}
          /> */}
        </section>
      </div>
    </>
  );
};
