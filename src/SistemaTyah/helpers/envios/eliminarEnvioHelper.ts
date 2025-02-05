import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IEnvios } from '../../interfaces/interfacesEnvios';
import { deleteEnvios, getEnvios } from '../apiEnvios';

export const eliminarEnvioHelper = async (
  id_Cliente: number,
  id_Envio: number,
  id_Estatus: number,
  filtros: object
): Promise<ApiResponse<IEnvios[]>> => {
  const payload = {
    id_Cliente,
    id_Envio,
    id_Estatus,
  };

  try {
    const response = await deleteEnvios(payload);

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
    const enviosData = await getEnvios(filtros);
    return enviosData;
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
