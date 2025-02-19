import { ApiResponse } from '../interfaces/interfacesApi';
import { IDashboard } from '../interfaces/interfacesDashboard';

const BASE_URL = import.meta.env.VITE_API_URL;

// Obtener Información del Dashboard
export const getEstadisticasDashboard = async (): Promise<
  ApiResponse<IDashboard[]>
> => {
  try {
    const response = await fetch(`${BASE_URL}/getEstadisticasDashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<IDashboard[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Clientes:', error);
    throw error;
  }
};
