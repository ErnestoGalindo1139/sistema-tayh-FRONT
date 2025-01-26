import React, { useEffect, useState } from 'react';
import { DataTable } from '../components/DataTable';
import Toast from '../components/Toast';
import { EditIcon } from '../icons/EditIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { AddIcon } from '../icons/AddIcon';
import { useTheme } from '../../ThemeContext';
import { IApiError } from '../interfaces/interfacesApi';
import { WaitScreen } from '../components/WaitScreen';
import { RetweetIcon } from '../icons/RetweetIcon';
import { Tooltip } from 'flowbite-react';
import {
  IFiltrosPedidos,
  IFormPedidos,
  IPedidos,
} from '../interfaces/interfacesPedidos';
import { getPedidos } from '../helpers/apiPedidos';
import { eliminarPedidoHelper } from '../helpers/pedidos/eliminarPedidoHelper';
import { IEstatus } from '../interfaces/interfacesEstatus';
import { getEstatus } from '../helpers/apiEstatus';
import { FormPedidos } from '../components/Pedidos/FormPedidos';
import { FiltrosPedidos } from '../components/Pedidos/FiltrosPedidos';

export const PedidosAdmin = (): React.JSX.Element => {
  const [pedidos, setPedidos] = useState<IPedidos[]>([]);
  const [pedido, setPedido] = useState<IFormPedidos>();

  const [estatusPedidos, setEstatusPedidos] = useState<IEstatus[]>([]);

  const [estatusPedidosFormulario, setEstatusPedidosFormulario] = useState<
    IEstatus[]
  >([]);

  const [filtros, setFiltros] = useState<IFiltrosPedidos>({
    id_Pedido: '',
    id_Cliente: '',
    fh_Pedido: '',
    fh_EnvioProduccion: '',
    fh_EntregaEstimada: '',
    nb_Cliente: '',
    id_Estatus: '',
  });

  const [sn_Editar, setSn_Editar] = useState<boolean>(false);
  const [sn_Visualizar, setSn_Visualizar] = useState<boolean>(false);
  const [sn_Agregar, setSn_Agregar] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchPedidos = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const pedidosData = await getPedidos(filtros);
        setPedidos(pedidosData.body);
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

    fetchPedidos();
  }, []);

  useEffect(() => {
    const fetchEstatusPedidos = async (): Promise<void> => {
      try {
        const estatusData = await getEstatus(3); // Modulo de Pedidos
        setEstatusPedidos(estatusData.body);
        setEstatusPedidosFormulario(estatusData.body);
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

    fetchEstatusPedidos();
  }, []);

  const columns: {
    id: keyof IPedidos;
    texto: string;
    visible: boolean;
    width: string;
  }[] = [
    { id: 'id_Pedido', texto: 'Folio Pedido', visible: true, width: '10%' },
    { id: 'id_Cliente', texto: 'Folio Cliente', visible: true, width: '10%' },
    { id: 'nb_Cliente', texto: 'Nombre Cliente', visible: true, width: '25%' },
    {
      id: 'fh_PedidoFormat',
      texto: 'Fecha Pedido',
      visible: true,
      width: '15%',
    },
    {
      id: 'fh_EnvioProduccionFormat',
      texto: 'Fecha Envío Producción',
      visible: true,
      width: '15%',
    },
    {
      id: 'fh_EntregaEstimadaFormat',
      texto: 'Fecha Entrega Estimada',
      visible: true,
      width: '15%',
    },
    { id: 'de_Estatus', texto: 'Estatus', visible: true, width: '10%' },
  ];

  const actions = [
    {
      icono: <EyeIcon className="text-blue-500" />,
      texto: 'Visualizar',
      onClick: (row: IPedidos): void => {
        setSn_Editar(false);
        setSn_Visualizar(true);
        limpiarPedido();
        console.log(row);

        setPedido({
          ...row,
        });
      },
      width: '20%',
    },
    {
      icono: <EditIcon className="text-[#a22694]" />,
      texto: 'Editar',
      onClick: (row: IPedidos): void => {
        setSn_Editar(true);
        setSn_Visualizar(false);
        limpiarPedido();
        setPedido({
          ...row,
        });
      },
    },
    {
      icono: <RetweetIcon className="text-black" />,
      texto: 'Finalizar Pedido',
      onClick: (row: IPedidos): void => {
        setSn_Editar(false);
        setSn_Visualizar(false);
        setPedido({ ...row });
      },
    },
  ];

  const limpiarPedido = (): void => {
    setPedido({
      id_Pedido: 0,
      id_Cliente: 0,
      fh_Pedido: '',
      fh_EnvioProduccion: '',
      fh_EntregaEstimada: '',
      id_ViaContacto: 0,
      de_ViaContacto: '',
      id_Estatus: '1',
      de_Estatus: '',
      id_Modelo: '',
      id_Talla: '',
      id_Color: '',
      id_TipoTela: '',
      id_TipoPrenda: '',
      de_Concepto: '',
      nu_Cantidad: 0,
      im_PrecioUnitario: 0,
      im_SubTotal: 0,
      im_Impuesto: 0,
      im_Total: 0,
      de_Genero: '',
    });
  };

  const eliminarPedido = async (id_Pedido: string): Promise<void> => {
    setIsLoading(true);
    const pedidosData = await eliminarPedidoHelper(id_Pedido, filtros);

    if (pedidosData.success) {
      setPedidos(pedidosData.body);
      setIsLoading(false);
    } else {
      return;
    }
  };

  return (
    <>
      {isLoading && <WaitScreen message="cargando..." />}

      {sn_Agregar || sn_Visualizar || sn_Editar ? (
        <FormPedidos
          setSn_Agregar={setSn_Agregar}
          setSn_Visualizar={setSn_Visualizar}
          setSn_Editar={setSn_Editar}
          sn_Editar={sn_Editar}
          sn_Visualizar={sn_Visualizar}
          row={
            pedido
              ? pedido
              : {
                  id_Pedido: 0,
                  id_Cliente: 0,
                  fh_Pedido: '',
                  fh_EnvioProduccion: '',
                  fh_EntregaEstimada: '',
                  id_ViaContacto: 0,
                  de_ViaContacto: '',
                  id_Estatus: 1,
                  de_Estatus: '',
                  // id_Detalle: '',
                  id_Modelo: '',
                  id_Talla: '',
                  id_Color: '',
                  id_TipoTela: '',
                  id_TipoPrenda: '',
                  de_Concepto: '',
                  nu_Cantidad: 0,
                  im_PrecioUnitario: 0,
                  im_SubTotal: 0,
                  im_Impuesto: 0,
                  im_Total: 0,
                  de_Genero: '',
                }
          }
          actualizarPedidos={setPedidos}
          filtros={filtros}
          estatusPedidos={estatusPedidosFormulario}
        />
      ) : (
        <div className={isDarkMode ? 'dark' : ''}>
          <section className="content dark:bg-[#020405]">
            {/* contenedor */}
            <div className="flex items-center justify-between">
              <div className="dark:text-white">
                <h2 className="font-bold text-[2.5rem]">Pedidos</h2>
                <p className="text-[1.6rem]">
                  Aquí puedes gestionar los Pedidos.
                </p>
              </div>

              <Tooltip
                content="Agregar Pedido"
                className="text-[1.3rem]"
                placement="bottom"
              >
                <button
                  onClick={() => {
                    setSn_Agregar(true);
                    setSn_Editar(false);
                    setSn_Visualizar(false);
                    limpiarPedido();
                  }}
                >
                  <AddIcon width="4em" height="4em" />
                </button>
              </Tooltip>
            </div>

            {/* Filtros */}
            <FiltrosPedidos
              filtros={filtros}
              setFiltros={setFiltros}
              estatusPedidos={estatusPedidos}
              actualizarPedidos={setPedidos}
              setIsLoading={setIsLoading}
            />

            <div className="table-container dark:bg-transparent">
              <DataTable
                data={pedidos}
                columns={columns}
                actions={actions}
                initialRowsPerPage={10}
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
};
