import React, { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { EditIcon } from '../icons/EditIcon';
import { AddIcon } from '../icons/AddIcon';
import { useDisclosure } from '@chakra-ui/react';
import { useTheme } from '../../ThemeContext';
import { WaitScreen } from '../components/WaitScreen';
import { Tooltip } from 'flowbite-react';

import { IFiltrosPrecios, IPrecios } from '../interfaces/interfacesPrecios';
import { FiltrosPrecios } from '../components/Precios/FiltrosPrecios';
import { ModalPreciosAgregar } from '../dialogs/ModalPreciosAgregar';
import { useForm } from '../hooks/useForm';

export const PreciosAdmin = (): React.JSX.Element => {
  const [precios, setPrecios] = useState<IPrecios[]>([]);
  const [precio, setPrecio] = useState<IPrecios>();

  const [sn_Editar, setSn_Editar] = useState<boolean>(false);
  const [sn_Visualizar, setSn_Visualizar] = useState<boolean>(false);

  const { formState: filtros, setFormState: setFiltros } =
    useForm<IFiltrosPrecios>({
      id_Modelo: 0,
      de_Genero: '',
      id_TipoPrenda: 0,
      id_Talla: 0,
      im_PrecioMinimo: 0,
      im_PrecioMaximo: 0,
    });

  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = useTheme();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  // const {
  //   isOpen: isConfirmOpen,
  //   onOpen: openConfirm,
  //   onClose: closeConfirm,
  // } = useDisclosure();

  const columns: {
    id: keyof IPrecios;
    texto: string;
    visible: boolean;
    width: string;
  }[] = [
    { id: 'de_Genero', texto: 'Genero', visible: false, width: '20%' },
    { id: 'id_Modelo', texto: 'ID Modelo', visible: false, width: '20%' },
    { id: 'id_TipoPrenda', texto: 'Tipo Prenda', visible: false, width: '20%' },
    { id: 'id_Talla', texto: 'Talla', visible: false, width: '20%' },
    { id: 'id_Precio', texto: 'ID', visible: true, width: '5%' },
    { id: 'de_GeneroCompleto', texto: 'Genero', visible: true, width: '15%' },
    { id: 'de_Modelo', texto: 'Modelo', visible: true, width: '15%' },
    { id: 'de_TipoPrenda', texto: 'Tipo Prenda', visible: true, width: '15%' },
    { id: 'de_Talla', texto: 'Talla', visible: true, width: '20%' },
    {
      id: 'im_PrecioUnitario',
      texto: 'Precio Unitario',
      visible: true,
      width: '20%',
    },
  ];

  const actions = [
    // {
    //   icono: <EyeIcon className="text-blue-500" />,
    //   texto: 'Visualizar',
    //   onClick: (row: IPrecios): void => {
    //     setSn_Editar(false);
    //     setSn_Visualizar(true);
    //     limpiarPrecios();
    //     openModal();
    //     setPrecio({
    //       ...row,
    //     });
    //   },
    // },
    {
      icono: <EditIcon className="text-[#a22694]" />,
      texto: 'Editar',
      onClick: (row: IPrecios): void => {
        setSn_Editar(true);
        setSn_Visualizar(false);
        limpiarPrecios();
        openModal();

        setPrecio({
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

  const limpiarPrecios = (): void => {
    setPrecio({
      id_Precio: 0,
      de_Genero: '',
      de_GeneroCompleto: '',
      id_TipoPrenda: 0,
      de_TipoPrenda: '',
      id_Talla: 0,
      de_Talla: '',
      im_PrecioUnitario: 0,
      id_Modelo: 0,
      de_Modelo: '',
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
              <h2 className="font-bold text-[2.5rem]">Precios</h2>
              <p className="text-[1.6rem]">
                Aquí puedes gestionar los Precios.
              </p>
            </div>

            <Tooltip
              content="Agregar Precio"
              className="text-[1.3rem]"
              placement="bottom"
            >
              <button
                onClick={() => {
                  setSn_Editar(false);
                  setSn_Visualizar(false);
                  limpiarPrecios();
                  openModal();
                }}
              >
                <AddIcon width="4em" height="4em" />
              </button>
            </Tooltip>
          </div>

          {/* Filtros */}
          <FiltrosPrecios
            filtros={filtros}
            setFiltros={setFiltros}
            actualizarPrecios={setPrecios}
            setIsLoading={setIsLoading}
          />

          {/* Grid | Tabla */}
          <div className="table-container dark:bg-transparent">
            <DataTable
              data={precios}
              columns={columns}
              actions={actions}
              initialRowsPerPage={10}
            />
          </div>

          {/* Modal para Agregar */}
          <ModalPreciosAgregar
            isOpen={isModalOpen}
            onClose={closeModal}
            actualizarPrecios={setPrecios}
            row={
              precio
                ? precio
                : {
                    id_Modelo: 0,
                    de_Genero: '',
                    id_TipoPrenda: 0,
                    id_Talla: 0,
                    im_PrecioUnitario: 0,
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
