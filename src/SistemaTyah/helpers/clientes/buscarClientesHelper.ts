import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IClientes } from '../../interfaces/interfacesClientes';
import { getClientes } from '../apiClientes';

export const buscarClientesHelper = async (
  filtros: object
): Promise<ApiResponse<IClientes[]>> => {
  try {
    const clientesData = await getClientes(filtros);
    return clientesData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Toast.fire({
      icon: 'error',
      title: 'Ocurrió un Error',
      text: errorMessage,
    });

    return {
      body: [],
      message: 'FALLE MOMO',
      success: false,
    };
  }
};
