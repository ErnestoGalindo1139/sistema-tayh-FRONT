import { ApiResponse } from '../../interfaces/interfacesApi';
import { IFormPedidos } from '../../interfaces/interfacesPedidos';

const BASE_URL = import.meta.env.VITE_API_URL;

export const calcularPrecioUnitarioHelper = async (
  payload: Partial<IFormPedidos>
): Promise<ApiResponse<number>> => {
  try {
    const response = await fetch(`${BASE_URL}/getPrecioUnitario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), // Mandar los filtros en la petición
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Clientes:', error);
    throw error;
  }
};
