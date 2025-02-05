import { ApiResponse } from '../interfaces/interfacesApi';
import { IEstatus } from '../interfaces/interfacesEstatus';

const BASE_URL = 'http://77.243.85.134:3000';

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
