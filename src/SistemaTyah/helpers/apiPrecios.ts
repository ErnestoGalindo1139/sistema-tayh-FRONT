import { ApiResponse } from '../interfaces/interfacesApi';
import {
  IFiltrosPrecios,
  IFormPrecios,
  IPrecios,
} from '../interfaces/interfacesPrecios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getPrecios = async (
  filtros: Partial<IFiltrosPrecios>
): Promise<ApiResponse<IPrecios[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getPrecios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IPrecios[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Precios:', error);
    throw error;
  }
};

export const createPrecios = async (
  pedido: IFormPrecios
): Promise<ApiResponse<IFormPrecios>> => {
  try {
    const response = await fetch(`${BASE_URL}/createPrecios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });

    const data: ApiResponse<IFormPrecios> = await response.json();

    // if (!data.success) {
    //   throw new Error(data.message);
    // }

    return data;
  } catch (error) {
    console.error('Error al crear Precio:', error);
    throw error;
  }
};

export const updatePrecios = async (
  pedido: Partial<IFormPrecios>
): Promise<ApiResponse<IFormPrecios>> => {
  try {
    const response = await fetch(`${BASE_URL}/updatePrecios`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...pedido }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IFormPrecios> = await response.json();

    // if (!data.success) {
    //   throw new Error(data.message);
    // }

    return data; // Devuelve el producto actualizado
  } catch (error) {
    console.error('Error al actualizar Precio:', error);
    throw error;
  }
};
