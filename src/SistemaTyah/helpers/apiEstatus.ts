import { ApiResponse } from '../interfaces/interfacesApi';
import { IEstatus } from '../interfaces/interfacesEstatus';

const BASE_URL = import.meta.env.VITE_API_URL;

// Obtener categorias
export const getEstatus = async (
  modulo: number | string
): Promise<ApiResponse<IEstatus[]>> => {
  const payload = {
    id_modulo: modulo,
  };

  try {
    const response = await fetch(`${BASE_URL}/getEstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IEstatus[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Clientes:', error);
    throw error;
  }
};
