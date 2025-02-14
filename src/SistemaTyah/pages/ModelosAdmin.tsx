import React, { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { EditIcon } from '../icons/EditIcon';
import { AddIcon } from '../icons/AddIcon';
import { useDisclosure } from '@chakra-ui/react';
import { useTheme } from '../../ThemeContext';
import { WaitScreen } from '../components/WaitScreen';
import { Tooltip } from 'flowbite-react';

import { IModelos } from '../interfaces/interfacesPedidos';
import { IFiltrosModelos } from '../interfaces/interfacesModelos';
import { FiltrosModelos } from '../components/Modelos/FiltrosModelos';
import { ModalModelosAgregar } from '../dialogs/ModalModelosAgregar';
import { useForm } from '../hooks/useForm';

export const ModelosAdmin = (): React.JSX.Element => {
  const [modelos, setModelos] = useState<IModelos[]>([]);
  const [modelo, setModelo] = useState<IModelos>();

  const [sn_Editar, setSn_Editar] = useState<boolean>(false);
  const [sn_Visualizar, setSn_Visualizar] = useState<boolean>(false);

  const {
    formState: filtros,
    setFormState: setFiltros,
    onInputChange,
  } = useForm<IFiltrosModelos>({
    id_Modelo: '',
    de_Genero: '',
    de_Modelo: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = useTheme();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const columns: {
    id: keyof IModelos;
    texto: string;
    visible: boolean;
    width: string;
  }[] = [
    { id: 'id_Modelo', texto: 'ID', visible: true, width: '20%' },
    { id: 'de_Genero', texto: 'Genero', visible: false, width: '20%' },
    { id: 'de_GeneroCompleto', texto: 'Genero', visible: true, width: '20%' },
    { id: 'de_Modelo', texto: 'Modelo', visible: true, width: '40%' },
  ];

  const actions = [
    // {
    //   icono: <EyeIcon className="text-blue-500" />,
    //   texto: 'Visualizar',
    //   onClick: (row: IPrecios): void => {
    //     setSn_Editar(false);
    //     setSn_Visualizar(true);
    //     limpiarModelos();
    //     openModal();
    //     setPrecio({
    //       ...row,
    //     });
    //   },
    // },
    {
      icono: <EditIcon className="text-[#a22694]" />,
      texto: 'Editar',
      onClick: (row: IModelos): void => {
        setSn_Editar(true);
        setSn_Visualizar(false);
        limpiarModelos();
        openModal();

        setModelo({
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

  const limpiarModelos = (): void => {
    setModelo({
      id_Modelo: '',
      de_Genero: '',
      de_GeneroCompleto: '',
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
              <h2 className="font-bold text-[2.5rem]">Modelos</h2>
              <p className="text-[1.6rem]">
                Aquí puedes gestionar los Modelos.
              </p>
            </div>

            <Tooltip
              content="Agregar Modelo"
              className="text-[1.3rem]"
              placement="bottom"
            >
              <button
                onClick={() => {
                  setSn_Editar(false);
                  setSn_Visualizar(false);
                  limpiarModelos();
                  openModal();
                }}
              >
                <AddIcon width="4em" height="4em" />
              </button>
            </Tooltip>
          </div>

          {/* Filtros */}
          <FiltrosModelos
            filtros={filtros}
            setFiltros={setFiltros}
            actualizarModelos={setModelos}
            setIsLoading={setIsLoading}
            onInputChange={onInputChange}
          />

          {/* Grid | Tabla */}
          <div className="table-container dark:bg-transparent">
            <DataTable
              data={modelos}
              columns={columns}
              actions={actions}
              initialRowsPerPage={10}
            />
          </div>

          {/* Modal para Agregar */}
          <ModalModelosAgregar
            isOpen={isModalOpen}
            onClose={closeModal}
            actualizarModelos={setModelos}
            row={
              modelo
                ? modelo
                : {
                    id_Modelo: '',
                    de_Genero: '',
                    de_Modelo: '',
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
