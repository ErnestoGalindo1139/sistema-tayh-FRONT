import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IPedidos } from '../../interfaces/interfacesPedidos';
import { getPedidos } from '../apiPedidos';

export const buscarPedidosHelper = async (
  filtros: object
): Promise<ApiResponse<IPedidos[]>> => {
  try {
    const pedidosData = await getPedidos(filtros);
    return pedidosData;
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
