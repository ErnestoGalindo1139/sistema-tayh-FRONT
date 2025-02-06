import React, { useEffect, useState } from 'react';
import { DataTable } from '../components/DataTable';
import Toast from '../components/Toast';
import { EditIcon } from '../icons/EditIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { AddIcon } from '../icons/AddIcon';
import { useDisclosure } from '@chakra-ui/react';
import { useTheme } from '../../ThemeContext';
import { IApiError } from '../interfaces/interfacesApi';
import {
  IClientes,
  IFiltrosClientes,
  IRedSocial,
} from '../interfaces/interfacesClientes';
import { WaitScreen } from '../components/WaitScreen';
import { deleteClientes, getClientes } from '../helpers/apiClientes';
import { ModalClientes } from '../dialogs/ModalClientes';
import { RetweetIcon } from '../icons/RetweetIcon';
import { Tooltip } from 'flowbite-react';
import { FiltrosClientes } from '../components/Clientes/FiltrosClientes';
import { ModalConfirmacionActivarInactivar } from '../dialogs/ModalConfirmacionActivarInactivar';

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

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { isDarkMode } = useTheme();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
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

  const columns: {
    id: keyof IClientes;
    texto: string;
    visible: boolean;
    width: string;
  }[] = [
    { id: 'id_Cliente', texto: 'Folio', visible: true, width: '5%' },
    { id: 'nb_Cliente', texto: 'Cliente', visible: true, width: '15%' },
    { id: 'de_Direccion', texto: 'Dirección', visible: true, width: '20%' },
    {
      id: 'de_CorreoElectronico',
      texto: 'Correo',
      visible: true,
      width: '10%',
    },
    { id: 'nb_Atendio', texto: 'Precio', visible: false, width: '10%' },
    {
      id: 'id_UsuarioRegistra',
      texto: 'Usuario Registra',
      visible: false,
      width: '10%',
    },
    {
      id: 'id_UsuarioModifica',
      texto: 'Usuario Modifica',
      visible: false,
      width: '10%',
    },
    {
      id: 'id_UsuarioElimina',
      texto: 'Usuario Elimina',
      visible: false,
      width: '10%',
    },
    {
      id: 'fh_CumpleanosFormat',
      texto: 'Cumpleaños Cliente',
      visible: true,
      width: '10%',
    },
    {
      id: 'fh_CumpleanosEmpresaFormat',
      texto: 'Cumpleaños Empresa',
      visible: true,
      width: '10%',
    },
    {
      id: 'fh_Registro',
      texto: 'Fecha Registro',
      visible: true,
      width: '10%',
    },
    {
      id: 'fh_Modificacion',
      texto: 'Fecha Modificación',
      visible: false,
      width: '10%',
    },
    {
      id: 'fh_Eliminacion',
      texto: 'Fecha Eliminación',
      visible: false,
      width: '10%',
    },
    { id: 'sn_Activo', texto: 'Estatus', visible: true, width: '10%' },
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

        const redesSociales =
          typeof row.redesSociales === 'string'
            ? JSON.parse(row.redesSociales || '[]') // Parsear solo si es un string
            : row.redesSociales || []; // Si es un arreglo, usarlo directamente

        setCliente({
          ...row,
          redesSociales: redesSociales.map(
            (red: IRedSocial): IRedSocial => ({
              id_RedSocial: red.id_RedSocial?.toString() || '',
              de_RedSocial: red.de_RedSocial,
              de_Enlace: red.de_Enlace,
            })
          ),
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

        const redesSociales =
          typeof row.redesSociales === 'string'
            ? JSON.parse(row.redesSociales || '[]') // Parsear solo si es un string
            : row.redesSociales || []; // Si es un arreglo, usarlo directamente

        setCliente({
          ...row,
          redesSociales: redesSociales.map(
            (red: IRedSocial): IRedSocial => ({
              id_RedSocial: red.id_RedSocial?.toString() || '',
              de_RedSocial: red.de_RedSocial,
              de_Enlace: red.de_Enlace,
            })
          ),
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
        abrirModalConfirmacion();
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
      sn_Activo: true,
    });
  };

  const eliminarCliente = async (
    id_Cliente: string,
    sn_Activo: boolean
  ): Promise<void> => {
    setIsLoading(true);
    const clientes = await deleteClientes({ id_Cliente });

    if (clientes.success) {
      Toast.fire({
        icon: 'success',
        title: 'Operación Exitosa',
        text: `Cliente ${sn_Activo ? 'Inactivado' : 'Activado'} correctamente`,
      });

      const clientesData = await getClientes(filtros);
      setClientes(clientesData.body);
      cerrarModalConfirmacion();
      setIsLoading(false);
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Ocurrió un Error',
        text: clientes.message,
      });
    }
  };

  const abrirModalConfirmacion = (): void => {
    setIsConfirmOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      {isLoading && <WaitScreen message="cargando..." />}
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
          <FiltrosClientes
            filtros={filtros}
            setFiltros={setFiltros}
            actualizarClientes={setClientes}
            setIsLoading={setIsLoading}
          />

          <div className="table-container dark:bg-transparent">
            <DataTable
              data={clientes}
              columns={columns}
              actions={actions}
              initialRowsPerPage={10}
            />
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
            filtros={filtros}
          />

          <ModalConfirmacionActivarInactivar
            isOpen={isConfirmOpen}
            onClose={cerrarModalConfirmacion}
            onConfirm={() =>
              eliminarCliente(
                cliente?.id_Cliente || '',
                cliente?.sn_Activo || false
              )
            }
            descripcion={cliente?.nb_Cliente || ''}
            objeto="Cliente"
            activo={cliente?.sn_Activo || false}
          />
        </section>
      </div>
    </>
  );
};
