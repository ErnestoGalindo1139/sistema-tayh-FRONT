import React, { useState, useEffect } from 'react';
import { IEspecificacionesPedidos } from '../interfaces/interfacesPedidos';
import { IApiError } from '../interfaces/interfacesApi';
import Toast from '../components/Toast';
import { getEspecificacionesPedidos } from '../helpers/apiPedidos';

// Definición de las props que se enviarán a la API
interface OrdenTrabajoProps {
  id_Especificacion?: number;
  de_Especificacion?: string;
  id_Modelo: number;
  id_Talla: number;
  de_Genero: string;
}

export const OrdenTrabajo = (props: OrdenTrabajoProps): React.JSX.Element => {
  const [especificacionesPedidos, setEspecificacionesPedidos] = useState<
    IEspecificacionesPedidos[]
  >([]);

  useEffect(() => {
    const fetchEspecificacionesPedidos = async (): Promise<void> => {
      try {
        const especificacionesPedidosData = await getEspecificacionesPedidos({
          ...props,
        });

        setEspecificacionesPedidos(especificacionesPedidosData.body);
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

    fetchEspecificacionesPedidos();
  }, []);

  return (
    <div className="bg-[#C0DFE7] min-h-screen pr-16 pl-16">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center pt-8 mb-8 border-b border-gray-400 pb-4">
        {/* Logo de la empresa */}
        <img
          src="../../../public/Logo-Tayh_Horizontal-Negro.png" // Reemplaza con la ruta correcta del logo
          alt="Logo Empresa"
          className="w-60 sm:w-96 h-auto object-contain mb-4 sm:mb-0 pl-8 pr-8"
        />
        {/* Título de la Orden */}
        <h1 className="text-4xl font-bold text-center sm:text-right">
          Orden de Trabajo
        </h1>
      </header>

      {/* Texto de especificaciones */}
      <h2 className="text-6xl font-semibold text-center mb-[6rem]">
        Especificaciones
      </h2>

      {/* Contenedor de imagen y especificaciones */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Imagen editada a la izquierda */}
        <div className="flex justify-center md:justify-start md:w-1/2">
          <img
            src="../../../public/Filipina Prueba Azul.png"
            alt="Imagen Editada"
            className="w-[40rem] h-auto rounded-lg m-auto"
          />
        </div>

        {/* Lista de especificaciones a la derecha */}
        <div className="md:w-2/3 space-y-4">
          {/* {modelos && modelos.length > 0 ? ( */}

          {especificacionesPedidos && especificacionesPedidos.length > 0 ? (
            especificacionesPedidos.map((especificacion) => (
              <div
                key={especificacion.id_Especificacion}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
              >
                <div className="font-bold mr-4 text-4xl text-blue-700">
                  {especificacion.nu_Especificacion}.
                </div>
                <div className="flex-grow text-4xl text-gray-800">
                  {especificacion.de_Especificacion}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
