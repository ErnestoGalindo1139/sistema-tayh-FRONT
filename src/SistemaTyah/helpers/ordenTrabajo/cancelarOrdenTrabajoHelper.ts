import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IFormCancelarOrdenTrabajo } from '../../interfaces/interfacesOrdenTrabajo';
import { cancelarOrdenTrabajo } from './apiOrdenTrabajo';

export const cancelarOrdenTrabajoHelper = async (
  ordenTrabajo: Partial<IFormCancelarOrdenTrabajo>
): Promise<ApiResponse<void>> => {
  try {
    const response = await cancelarOrdenTrabajo(ordenTrabajo);

    if (!response.success) {
      Toast.fire({
        icon: 'error',
        title: 'Ocurrió un Error',
        text: response.message,
      });
      return {
        body: undefined,
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
    return {
      body: undefined,
      message: 'Operación exitosa',
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    Toast.fire({
      icon: 'error',
      title: 'Ocurrió un Error',
      text: errorMessage,
    });
    return {
      body: undefined,
      message: 'FALLE MOMO',
      success: false,
    };
  }
};
