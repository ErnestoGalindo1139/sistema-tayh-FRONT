import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IPedidos } from '../../interfaces/interfacesPedidos';
import { deletePedido, getPedidos } from '../apiPedidos';

export const eliminarPedidoHelper = async (
  id_Pedido: string,
  filtros: object
): Promise<ApiResponse<IPedidos[]>> => {
  try {
    const response = await deletePedido(id_Pedido);

    if (!response.success) {
      Toast.fire({
        icon: 'error',
        title: 'Ocurrió un Error',
        text: response.message,
      });
      return {
        body: [],
        message: 'FALLE MOMO',
        success: false,
      };
    }

    Toast.fire({
      icon: 'success',
      title: 'Operación exitosa',
      text: response.message,
    });

    // Actualizar los clientes
    const pedidosData = await getPedidos(filtros);
    return pedidosData;
  } catch (error: unknown) {
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
