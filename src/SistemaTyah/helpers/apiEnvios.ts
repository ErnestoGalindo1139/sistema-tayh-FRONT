import { ApiResponse } from '../interfaces/interfacesApi';
import {
  IEnvios,
  IFiltrosEnvios,
  IFormEnvios,
} from '../interfaces/interfacesEnvios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Obtener envios
export const getEnvios = async (
  filtros: Partial<IFiltrosEnvios>
): Promise<ApiResponse<IEnvios[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getEnvios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IEnvios[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los Envios:', error);
    throw error;
  }
};

// Crear Envio
export const createEnvios = async (
  envio: IFormEnvios
): Promise<ApiResponse<IFormEnvios>> => {
  try {
    const response = await fetch(`${BASE_URL}/createEnvios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(envio),
    });

    const data: ApiResponse<IFormEnvios> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data; // Devuelve el producto creado
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Actualizar envio
export const updateEnvios = async (
  envio: Partial<IFormEnvios>
): Promise<ApiResponse<IFormEnvios>> => {
  try {
    const response = await fetch(`${BASE_URL}/updateEnvios`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...envio }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IFormEnvios> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data; // Devuelve el producto actualizado
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Cancelar / Reanudar envio
export const deleteEnvios = async (
  envio: Partial<IFormEnvios>
): Promise<ApiResponse<IFormEnvios>> => {
  try {
    const response = await fetch(`${BASE_URL}/deleteEnvios`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...envio }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IFormEnvios> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data; // Devuelve el envio actualizado
  } catch (error) {
    console.error('Error al cancelar / reanudar pedido:', error);
    throw error;
  }
};
