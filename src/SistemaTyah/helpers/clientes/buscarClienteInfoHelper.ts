import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IClienteInfo } from '../../interfaces/interfacesClientes';
import { getInfoCliente } from '../apiClientes';

export const buscarClienteInfoHelper = async (
  filtros: object
): Promise<ApiResponse<IClienteInfo[]>> => {
  try {
    const clientesData = await getInfoCliente(filtros);
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
