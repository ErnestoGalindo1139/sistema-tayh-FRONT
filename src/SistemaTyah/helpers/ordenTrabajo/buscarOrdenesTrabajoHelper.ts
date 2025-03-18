import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IOrdenesTrabajo } from '../../interfaces/interfacesOrdenTrabajo';
import { getOrdenesTrabajo } from './apiOrdenTrabajo';

export const buscarOrdenesTrabajoHelper = async (
  filtros: object
): Promise<ApiResponse<IOrdenesTrabajo[]>> => {
  try {
    const ordenesTrabajoData = await getOrdenesTrabajo(filtros);
    return ordenesTrabajoData;
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
