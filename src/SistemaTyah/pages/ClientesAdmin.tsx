import React, { useEffect, useState } from 'react';
import { DataTable } from '../components/DataTable';
import Toast from '../components/Toast';
import { EditIcon } from '../icons/EditIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { AddIcon } from '../icons/AddIcon';
import { useDisclosure } from '@chakra-ui/react';
// import { ModalProductos } from '../components/ModalProductos';
// import { ModalConfirmacion } from '../components/ModalConfirmacion';
// import { WaitScreen } from '../components/WaitScreen';
// import { deleteProducto, getProductos } from '../helpers/apIClientess';
import { useTheme } from '../../ThemeContext';
// import { getCategorias } from '../helpers/apiCategorias';
import {
  IApiError,
  // IFiltrosProductos,
  // IFormCategorias,
  IClientes,
  IFiltrosClientes,
} from '../interfaces/interfaces';
import { WaitScreen } from '../components/WaitScreen';
import { deleteClientes, getClientes } from '../helpers/apiClientes';
import { ModalClientes } from '../dialogs/ModalClientes';
import { ModalConfirmacion } from '../dialogs/ModalConfirmacion';
import { RetweetIcon } from '../icons/RetweetIcon';
import { Tooltip, Label, Select, TextInput, Button } from 'flowbite-react';
import { SearchIcon } from '../icons/SearchIcon';

export const ClientesAdmin = (): React.JSX.Element => {
  const [clientes, setClientes] = useState<IClientes[]>([]);
  const [cliente, setCliente] = useState<IClientes>();

  const [filtros, setFiltros] = useState<IFiltrosClientes>({
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
    nu_TelefonoRedLocal: '',
    nu_TelefonoCelular: '',
    nu_TelefonoWhatsApp: '',
    fh_Registro: '',
    fh_Modificacion: '',
    fh_Eliminacion: '',
    sn_Activo: true,
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
    const fetchClientes = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const clientesData = await getClientes(filtros);
        setClientes(clientesData.body);
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

    fetchClientes();
  }, []);

  // useEffect(() => {
  //   const fetchCategorias = async (): Promise<void> => {
  //     try {
  //       const categoriasData = await getCategorias({});
  //       setCategorias(categoriasData.body);
  //     } catch (error) {
  //       const errorMessage =
  //         (error as IApiError).message || 'Ocurrió un error desconocido';
  //       Toast.fire({
  //         icon: 'error',
  //         title: 'Ocurrió un Error',
  //         text: errorMessage,
  //       });
  //     }
  //   };

  //   fetchCategorias();
  // }, []);

  const columns: { id: keyof IClientes; texto: string; visible: boolean }[] = [
    { id: 'id_Cliente', texto: 'Folio', visible: true },
    { id: 'nb_Cliente', texto: 'Nombre del Cliente', visible: true },
    { id: 'de_Direccion', texto: 'Dirección', visible: true },
    { id: 'de_CorreoElectronico', texto: 'Correo', visible: false },
    { id: 'nb_Atendio', texto: 'Precio', visible: false },
    { id: 'id_UsuarioRegistra', texto: 'Usuario Registra', visible: false },
    { id: 'id_UsuarioModifica', texto: 'Usuario Modifica', visible: false },
    { id: 'id_UsuarioElimina', texto: 'Usuario Elimina', visible: false },
    { id: 'fh_CumpleanosFormat', texto: 'Cumpleaños Cliente', visible: true },
    {
      id: 'fh_CumpleanosEmpresaFormat',
      texto: 'Cumpleaños Empresa',
      visible: true,
    },
    { id: 'fh_Registro', texto: 'Fecha Registro', visible: true },
    { id: 'fh_Modificacion', texto: 'Fecha Modificación', visible: false },
    { id: 'fh_Eliminacion', texto: 'Fecha Eliminación', visible: false },
    { id: 'sn_Activo', texto: 'Activo', visible: true },
  ];

  const actions = [
    {
      icono: <EyeIcon className="text-blue-500" />,
      texto: 'Visualizar',
      onClick: (row: IClientes): void => {
        setSn_Editar(false);
        setSn_Visualizar(true);
        limpiarCliente();
        openModal();
        setCliente({
          ...row,
        });
      },
    },
    {
      icono: <EditIcon className="text-[#a22694]" />,
      texto: 'Editar',
      onClick: (row: IClientes): void => {
        setSn_Editar(true);
        setSn_Visualizar(false);
        limpiarCliente();
        openModal();
        setCliente({
          ...row,
        });
      },
    },
    {
      icono: <RetweetIcon className="text-black" />,
      texto: 'Activar / Inactivar',
      onClick: (row: IClientes): void => {
        setSn_Editar(false);
        setSn_Visualizar(false);
        setCliente({ ...row });
        openConfirm();
      },
    },
  ];

  const limpiarCliente = (): void => {
    setCliente({
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
      sn_Activo: false,
    });
  };

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
      const clientesData = await getClientes(filtros);
      setClientes(clientesData.body);
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

  const buscarClientes = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const clientesData = await getClientes(filtros);
      setClientes(clientesData.body);
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
              <h2 className="font-bold text-[2.5rem]">Clientes</h2>
              <p className="text-[1.6rem]">
                Aquí puedes gestionar los Clientes.
              </p>
            </div>

            <Tooltip
              content="Agregar Cliente"
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
                  <Label className="text-[1.6rem] font-bold">Folio</Label>
                  <TextInput
                    type="text"
                    placeholder="Folio del Cliente"
                    className="dark:text-white text-[1.4rem]"
                    value={filtros.id_Cliente}
                    onChange={(e) =>
                      setFiltros({ ...filtros, id_Cliente: e.target.value })
                    }
                    style={{
                      fontSize: '1.4rem',
                      border: '1px solid #b9b9b9',
                      backgroundColor: '#ffffff',
                    }}
                    sizing="lg"
                  />
                </div>
                <div className="dark:text-white">
                  <Label className="text-[1.6rem] font-bold">Nombre</Label>
                  <TextInput
                    type="text"
                    placeholder="Nombre del Cliente"
                    className="dark:text-white"
                    value={filtros.nb_Cliente}
                    onChange={(e) =>
                      setFiltros({ ...filtros, nb_Cliente: e.target.value })
                    }
                    style={{
                      fontSize: '1.4rem',
                      border: '1px solid #b9b9b9',
                      backgroundColor: '#ffffff',
                    }}
                    sizing="lg"
                  />
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white font-bold">
                    Mes Cumpleaños
                  </Label>

                  <Select
                    value={filtros.fh_Cumpleanos}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        fh_Cumpleanos: e.target.value,
                      })
                    }
                    sizing="lg"
                    style={{
                      fontSize: '1.4rem',
                      border: '1px solid #b9b9b9',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="01">Enero</option>
                    <option value="02">Febrero</option>
                    <option value="03">Marzo</option>
                    <option value="04">Abril</option>
                    <option value="05">Mayo</option>
                    <option value="06">Junio</option>
                    <option value="07">Julio</option>
                    <option value="08">Agosto</option>
                    <option value="09">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </Select>
                </div>
                <div>
                  <Label className="text-[1.6rem] dark:text-white font-semibold">
                    Estatus
                  </Label>
                  <Select
                    value={
                      filtros.sn_Activo === null
                        ? ''
                        : filtros.sn_Activo
                          ? '1'
                          : '0'
                    }
                    className="dark:text-white"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFiltros({
                        ...filtros,
                        sn_Activo: value === '' ? null : value === '1',
                      });
                    }}
                    sizing="lg"
                    style={{
                      fontSize: '1.4rem',
                      border: '1px solid #b9b9b9',
                      backgroundColor: '#ffffff',
                    }}
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
                  </Select>
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
            <DataTable data={clientes} columns={columns} actions={actions} />
          </div>

          <ModalClientes
            isOpen={isModalOpen}
            onClose={closeModal}
            actualizarClientes={setClientes}
            row={
              cliente
                ? cliente
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
          />

          <ModalConfirmacion
            isOpen={isConfirmOpen}
            onClose={closeConfirm}
            onConfirm={() => eliminarCliente(cliente?.id_Cliente || '')}
            descripcion={cliente?.nb_Cliente || ''}
            objeto="Cliente"
            activo={cliente?.sn_Activo || false}
          />
        </section>
      </div>
    </>
  );
};
