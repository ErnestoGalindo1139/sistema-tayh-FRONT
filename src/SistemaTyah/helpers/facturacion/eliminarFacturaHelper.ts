import Toast from '../../components/Toast';
import { ApiResponse } from '../../interfaces/interfacesApi';
import { IEnvios } from '../../interfaces/interfacesEnvios';
import { IFacturacion } from '../../interfaces/interfacesFacturacion';
import { deleteFacturas, getFacturas } from './apiFacturacion';

export const eliminarFacturaHelper = async (
  id_Factura: number,
  filtros: object
): Promise<ApiResponse<IFacturacion[]>> => {
  const payload = {
    id_Factura,
  };

  try {
    const response = await deleteFacturas(payload);

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

    // Actualizar las facturas
    const facturasData = await getFacturas(filtros);
    return facturasData;
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
