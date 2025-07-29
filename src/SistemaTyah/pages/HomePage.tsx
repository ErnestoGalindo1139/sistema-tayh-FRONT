import React, { useEffect, useState } from 'react';
import { getFechaCumpleanosClientes } from '../helpers/apiClientes';
import { ICumpleanosClientes } from '../interfaces/interfacesClientes';
import Toast from '../components/Toast';
import { IApiError } from '../interfaces/interfacesApi';
import { Card, Badge, Tooltip } from 'flowbite-react';
import { getEstadisticasDashboard } from '../helpers/apiDashboard';
import { IDashboard } from '../interfaces/interfacesDashboard';
import { WaitScreen } from '../components/WaitScreen';
import {
  FaUsers,
  FaTruck,
  FaShoppingCart,
  FaDollarSign,
  FaBoxes,
} from 'react-icons/fa';
import { ModalInfoCliente } from '../dialogs/ModalInfoCliente';

const obtenerIcono = (id: string | number, color: string) => {
  const className = `text-2xl text-${color}-700`;

  switch (id) {
    case '1':
    case 1:
      return <FaUsers className={className} />; // Clientes
    case '2':
    case 2:
      return <FaTruck className={className} />; // Envíos
    case '3':
    case 3:
      return <FaShoppingCart className={className} />; // Pedidos
    case '4':
    case 4:
      return <FaDollarSign className={className} />; // Ventas
    case '5':
    case 5:
      return <FaBoxes className={className} />; // Inventario
    default:
      return null;
  }
};

export const HomePage = (): React.JSX.Element => {
  // Estado para manejar la carga de la página
  const [cumpleanosClientes, setCumpleanosClientes] = useState<
    ICumpleanosClientes[]
  >([]);

  const [estadisticas, setEstadisticas] = useState<IDashboard[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ICumpleanosClientes | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchDashboard = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const estadisticasDashboard = await getEstadisticasDashboard();
        setEstadisticas(estadisticasDashboard.body);
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

    fetchDashboard();
  }, []);

  // Obtener las fechas de cumpleaños de los clientes
  useEffect(() => {
    const fetchCumpleanosClientes = async (): Promise<void> => {
      try {
        const cumpleanosData = await getFechaCumpleanosClientes();
        setCumpleanosClientes(cumpleanosData.body);

        // Mostrar un Toast por cada cliente encontrado
        // cumpleanosData.body.forEach(
        //   (cliente: ICumpleanosClientes, index: number) => {
        //     setTimeout(() => {
        //       Toast.fire({
        //         icon: 'info',
        //         title:
        //           cliente.nu_DiasParaCumpleanos === 0
        //             ? '¡Feliz Cumpleaños!'
        //             : 'Próximo a Cumplir',
        //         text: cliente.mensaje,
        //         timer: 4000, // Escalonar cada Toast con un pequeño retraso
        //       });
        //     }, index * 4000); // Mostrar cada Toast cada 4 segundos
        //   }
        // );
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

    fetchCumpleanosClientes();
  }, []);

  return (
    <>
      {isLoading && <WaitScreen message="cargando Estadisticas..." />}
      <div className="p-6">
        <div className="mb-8">
          {/* Línea principal */}
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Bienvenido al Sistema TAYH
            </h1>
          </div>

          {/* Línea de características */}
          <div className="flex items-center gap-4 pl-12">
            <span className="inline-flex items-center text-lg text-gray-600 dark:text-gray-300">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Gestión de Inventario
            </span>

            <span className="text-gray-300 dark:text-gray-600">|</span>

            <span className="inline-flex items-center text-lg text-gray-600 dark:text-gray-300">
              <svg
                className="w-5 h-5 mr-2 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Automatización de Pedidos
            </span>
          </div>
        </div>

        {/* Cards de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {estadisticas && estadisticas.length > 0 ? (
            estadisticas?.map((estadistica, index) => (
              <Card key={index} className="text-center">
                <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                  <span>{obtenerIcono(estadistica.id, estadistica.color)}</span>
                  {estadistica.titulo}
                </h2>
                <p
                  className={`text-4xl font-bold text-${estadistica.color}-600`}
                >
                  {estadistica.valor}
                </p>
                <Badge
                  color={estadistica.color}
                  className="mt-2 text-xl p-[0.4rem] rounded-xl"
                >
                  {estadistica.variacion}% este mes
                </Badge>
              </Card>
            ))
          ) : (
            <></>
          )}
        </div>

        {/* Lista de Cumpleaños */}
        {cumpleanosClientes && cumpleanosClientes.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Próximos Cumpleaños</h2>
            <ul>
              {cumpleanosClientes.map((cliente, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setClienteSeleccionado(cliente);
                    setMostrarModal(true);
                  }}
                  className="cursor-pointer flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-blue-50 hover:rounded-lg"
                >
                  <div>
                    <p className="text-2xl font-semibold mt-1">
                      {cliente.nb_Cliente}
                    </p>
                    <p className="text-xl text-gray-600 mb-1">
                      {cliente.mensaje}
                    </p>
                  </div>
                  <Badge
                    color={
                      cliente.nu_DiasParaCumpleanos === 0
                        ? 'success'
                        : cliente.nu_DiasParaCumpleanos >= 1 &&
                            cliente.nu_DiasParaCumpleanos <= 3
                          ? 'warning'
                          : 'failure'
                    }
                    className="text-xl"
                  >
                    {cliente.nu_DiasParaCumpleanos === 0
                      ? '¡Hoy es su cumpleaños!'
                      : cliente.nu_DiasParaCumpleanos === 1
                        ? 'Falta 1 día'
                        : `Faltan ${cliente.nu_DiasParaCumpleanos} días`}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>

      <ModalInfoCliente
        open={mostrarModal}
        onClose={() => setMostrarModal(false)}
        cliente={clienteSeleccionado}
      />
    </>
  );
};
