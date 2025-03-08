import React, { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { EditIcon } from '../icons/EditIcon';
import { AddIcon } from '../icons/AddIcon';
import { useDisclosure } from '@chakra-ui/react';
import { useTheme } from '../../ThemeContext';
import { WaitScreen } from '../components/WaitScreen';
import { Tooltip } from 'flowbite-react';

import { FiltrosModelos } from '../components/Modelos/FiltrosModelos';
import { ModalModelosAgregar } from '../dialogs/ModalModelosAgregar';
import { useForm } from '../hooks/useForm';
import {
  IFiltrosInventarios,
  IInventarios,
} from '../interfaces/interfacesInventarios';
import { FiltrosInventarios } from '../components/Inventario/FiltrosInventarios';
import { ModalInventariosAgregar } from '../dialogs/ModalInventariosAgregar';

export const InventarioAdmin = (): React.JSX.Element => {
  const [inventarios, setInventarios] = useState<IInventarios[]>([]);
  const [inventario, setInventario] = useState<IInventarios>();

  const [sn_Editar, setSn_Editar] = useState<boolean>(false);
  const [sn_Visualizar, setSn_Visualizar] = useState<boolean>(false);

  const {
    formState: filtros,
    setFormState: setFiltros,
    onInputChange,
  } = useForm<IFiltrosInventarios>({
    id_Inventario: '',
    id_Modelo: '',
    id_Talla: '',
    id_Color: '',
    id_TipoPrenda: '',
    de_Genero: '',
    nu_Cantidad: '',
    de_GeneroCompleto: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = useTheme();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const columns: {
    id: keyof IInventarios;
    texto: string;
    visible: boolean;
    width: string;
  }[] = [
    { id: 'id_Modelo', texto: 'Producto', visible: false, width: '20%' },
    { id: 'id_Talla', texto: 'Talla', visible: false, width: '20%' },
    { id: 'id_Color', texto: 'Color', visible: false, width: '20%' },
    { id: 'id_TipoPrenda', texto: 'Color', visible: false, width: '20%' },
    { id: 'de_Genero', texto: 'Genero', visible: false, width: '20%' },
    { id: 'id_Inventario', texto: 'ID', visible: true, width: '5%' },
    { id: 'de_GeneroCompleto', texto: 'Genero', visible: true, width: '15%' },
    { id: 'de_Modelo', texto: 'Modelo', visible: true, width: '20%' },
    { id: 'de_TipoPrenda', texto: 'Prenda', visible: true, width: '10%' },
    { id: 'de_Talla', texto: 'Talla', visible: true, width: '10%' },
    { id: 'de_Color', texto: 'Color', visible: true, width: '20%' },
    {
      id: 'nu_Cantidad',
      texto: 'Cantidad Disponible',
      visible: true,
      width: '20%',
      textAlign: 'right',
    },
  ];

  const actions = [
    // {
    //   icono: <EyeIcon className="text-blue-500" />,
    //   texto: 'Visualizar',
    //   onClick: (row: IPrecios): void => {
    //     setSn_Editar(false);
    //     setSn_Visualizar(true);
    //     limpiarInventarios();
    //     openModal();
    //     setPrecio({
    //       ...row,
    //     });
    //   },
    // },
    {
      icono: <EditIcon className="text-[#a22694]" />,
      texto: 'Editar',
      onClick: (row: IInventarios): void => {
        setSn_Editar(true);
        setSn_Visualizar(false);
        limpiarInventarios();
        openModal();

        setInventario({
          ...row,
        });
      },
    },
    // {
    //   icono: <RetweetIcon className="text-black" />,
    //   texto: 'Activar / Inactivar',
    //   onClick: (row: IPrecios): void => {
    //     setSn_Editar(false);
    //     setSn_Visualizar(false);
    //     setPrecio({ ...row });
    //     openConfirm();
    //   },
    // },
  ];

  const limpiarInventarios = (): void => {
    setInventario({
      id_Inventario: '',
      id_Modelo: '',
      id_Talla: '',
      id_Color: '',
      de_Modelo: '',
      id_TipoPrenda: '',
      de_Talla: '',
      de_Color: '',
      de_Genero: '',
      de_GeneroCompleto: '',
      nu_Cantidad: '',
      sn_Activo: false,
      fh_Registro: '',
      fh_Actualizacion: '',
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
              <h2 className="font-bold text-[2.5rem]">Inventario</h2>
              <p className="text-[1.6rem]">
                Aquí puedes gestionar tu Inventario.
              </p>
            </div>

            <Tooltip
              content="Agregar Inventario"
              className="text-[1.3rem]"
              placement="bottom"
            >
              <button
                onClick={() => {
                  setSn_Editar(false);
                  setSn_Visualizar(false);
                  limpiarInventarios();
                  openModal();
                }}
              >
                <AddIcon width="4em" height="4em" />
              </button>
            </Tooltip>
          </div>

          {/* Filtros */}
          <FiltrosInventarios
            filtros={filtros}
            setFiltros={setFiltros}
            actualizarInventarios={setInventarios}
            setIsLoading={setIsLoading}
            onInputChange={onInputChange}
          />

          {/* Grid | Tabla */}
          <div className="table-container dark:bg-transparent">
            <DataTable
              data={inventarios}
              columns={columns}
              actions={actions}
              initialRowsPerPage={10}
            />
          </div>

          {/* Modal para Agregar */}
          <ModalInventariosAgregar
            isOpen={isModalOpen}
            onClose={closeModal}
            actualizarInventarios={setInventarios}
            row={
              inventario
                ? inventario
                : {
                    id_Inventario: '',
                    id_Modelo: '',
                    id_Talla: '',
                    id_Color: '',
                    id_TipoPrenda: '',
                    de_Modelo: '',
                    de_Talla: '',
                    de_Color: '',
                    de_Genero: '',
                    de_GeneroCompleto: '',
                    nu_Cantidad: '',
                    sn_Activo: false,
                    fh_Registro: '',
                    fh_Actualizacion: '',
                  }
            }
            sn_Editar={sn_Editar}
            sn_Visualizar={sn_Visualizar}
            filtros={filtros}
          />

          {/* <ModalConfirmacion
            isOpen={isConfirmOpen}
            onClose={closeConfirm}
            onConfirm={() => eliminarCliente(cliente?.id_Cliente || '')}
            descripcion={cliente?.nb_Cliente || ''}
            objeto="Cliente"
            activo={cliente?.sn_Activo || false}
          /> */}
        </section>
      </div>
    </>
  );
};
