import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IEnvios } from '../../interfaces/interfacesEnvios';
import { getEnvios } from '../apiEnvios';

export const buscarEnviosHelper = async (
  filtros: object
): Promise<ApiResponse<IEnvios[]>> => {
  try {
    const enviosData = await getEnvios(filtros);
    return enviosData;
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
