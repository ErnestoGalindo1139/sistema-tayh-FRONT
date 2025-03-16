import { ApiResponse } from '../interfaces/interfacesApi';
import { IEstatus } from '../interfaces/interfacesEstatus';
import { IFormPedidos } from '../interfaces/interfacesPedidos';

const BASE_URL = import.meta.env.VITE_API_URL;

// Obtener categorias
export const getEstatus = async (
  modulo: number | string
): Promise<ApiResponse<IEstatus[]>> => {
  const payload = {
    id_Modulo: modulo,
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

// Actualizar producto
export const updateEstatus = async (
  pedido: Partial<IFormPedidos>
): Promise<ApiResponse<IFormPedidos>> => {
  try {
    const response = await fetch(`${BASE_URL}/updateEstatus`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...pedido }),
    });

    const data: ApiResponse<IFormPedidos> = await response.json();

    return data; // Devuelve el producto actualizado
  } catch (error) {
    console.error('Error al actualizar el estatus:', error);
    throw error;
  }
};
