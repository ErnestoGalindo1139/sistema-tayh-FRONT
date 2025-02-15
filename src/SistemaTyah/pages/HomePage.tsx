import React, { useEffect, useState } from 'react';
import { getFechaCumpleanosClientes } from '../helpers/apiClientes';
import { ICumpleanosClientes } from '../interfaces/interfacesClientes';
import Toast from '../components/Toast';
import { IApiError } from '../interfaces/interfacesApi';
import { Card, Badge } from 'flowbite-react';

export const HomePage = (): React.JSX.Element => {
  // Estado para manejar la carga de la página
  const [cumpleanosClientes, setCumpleanosClientes] = useState<
    ICumpleanosClientes[]
  >([]);

  // Estado para las estadísticas
  const [estadisticas, setEstadisticas] = useState([
    {
      titulo: 'Clientes Nuevos',
      valor: 120,
      variacion: '+5% este mes',
      color: 'blue',
      icono: '👥',
    },
    {
      titulo: 'Envíos',
      valor: 45,
      variacion: '+12% este mes',
      color: 'green',
      icono: '🚚',
    },
    {
      titulo: 'Pedidos',
      valor: 89,
      variacion: '+8% este mes',
      color: 'purple',
      icono: '📦',
    },
    {
      titulo: 'Ventas',
      valor: 23000,
      variacion: '+15% este mes',
      color: 'red',
      icono: '💰',
    },

    {
      titulo: 'Inventario',
      valor: 560,
      variacion: '-2% este mes',
      color: 'yellow',
      icono: '📊',
    },
  ]);

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido al sistema de TAYH - Test
      </h1>

      {/* Cards de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {estadisticas.map((estadistica, index) => (
          <Card key={index} className="text-center">
            <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
              <span>{estadistica.icono}</span>
              {estadistica.titulo}
            </h2>
            <p className={`text-4xl font-bold text-${estadistica.color}-600`}>
              {estadistica.valor}
            </p>
            <Badge
              color={estadistica.color}
              className="mt-2 text-xl p-[0.4rem] rounded-xl"
            >
              {estadistica.variacion}
            </Badge>
          </Card>
        ))}
      </div>

      {/* Lista de Cumpleaños */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">Próximos Cumpleaños</h2>
        <ul>
          {cumpleanosClientes.map((cliente, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
            >
              <div>
                <p className="text-2xl font-semibold mt-1">
                  {cliente.nb_Cliente}
                </p>
                <p className="text-xl text-gray-600 mb-1">{cliente.mensaje}</p>
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
    </div>
  );
};
