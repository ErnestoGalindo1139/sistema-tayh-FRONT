import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IFacturacion } from '../../interfaces/interfacesFacturacion';
import { getFacturas } from './apiFacturacion';

export const buscarFacturasHelper = async (
  filtros: object
): Promise<ApiResponse<IFacturacion[]>> => {
  try {
    const clientesData = await getFacturas(filtros);
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
