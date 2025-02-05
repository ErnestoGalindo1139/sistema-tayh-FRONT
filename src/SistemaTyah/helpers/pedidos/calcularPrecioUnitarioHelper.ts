import { ApiResponse } from '../../interfaces/interfacesApi';
import { IFormPedidos } from '../../interfaces/interfacesPedidos';

const BASE_URL = 'http://77.243.85.134:3000';

export const calcularPrecioUnitarioHelper = async (
  payload: Partial<IFormPedidos>
): Promise<ApiResponse<number>> => {
  console.log(payload);

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
