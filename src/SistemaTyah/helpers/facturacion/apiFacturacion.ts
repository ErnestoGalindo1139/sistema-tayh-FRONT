import { ApiResponse } from '../../interfaces/interfacesApi';
import {
  IFacturacion,
  IFiltrosFacturacion,
  IFormFacturacion,
} from '../../interfaces/interfacesFacturacion';

// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = 'https://apis-grstechs.com';

// Obtener facturas
export const getFacturas = async (
  filtros: Partial<IFiltrosFacturacion>
): Promise<ApiResponse<IFacturacion[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getFacturas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IFacturacion[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener las Facturas:', error);
    throw error;
  }
};

// Crear factura
export const createFactura = async (
  factura: IFormFacturacion
): Promise<ApiResponse<IFormFacturacion>> => {
  try {
    const response = await fetch(`${BASE_URL}/createFactura`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(factura),
    });

    const data: ApiResponse<IFormFacturacion> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data; // Devuelve el factura creado
  } catch (error) {
    console.error('Error al crear la factura:', error);
    throw error;
  }
};

// Actualizar factura
export const updateFactura = async (
  factura: Partial<IFormFacturacion>
): Promise<ApiResponse<IFormFacturacion>> => {
  try {
    const response = await fetch(`${BASE_URL}/updateFactura`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...factura }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IFormFacturacion> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data; // Devuelve el factura actualizado
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    throw error;
  }
};

// Cancelar / reactivar factura
export const deleteFacturas = async (
  envio: Partial<IFormFacturacion>
): Promise<ApiResponse<IFormFacturacion>> => {
  try {
    const response = await fetch(`${BASE_URL}/deleteFactura`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...envio }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IFormFacturacion> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data; // Devuelve la factura actualizado
  } catch (error) {
    console.error('Error al cancelar / reactivar factura:', error);
    throw error;
  }
};
