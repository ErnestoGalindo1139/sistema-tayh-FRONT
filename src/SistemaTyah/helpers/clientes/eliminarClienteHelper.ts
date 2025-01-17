import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IClientes } from '../../interfaces/interfacesClientes';
import { deleteClientes, getClientes } from '../apiClientes';

export const eliminarClienteHelper = async (
  id_Cliente: string,
  filtros: object
): Promise<ApiResponse<IClientes[]>> => {
  const payload = {
    id_Cliente,
  };

  try {
    const response = await deleteClientes(payload);

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
    const clientesData = await getClientes(filtros);
    return clientesData;
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
