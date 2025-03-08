import { ApiResponse } from '../interfaces/interfacesApi';
import {
  IFiltrosInventarios,
  IFormInventarios,
  IInventarios,
} from '../interfaces/interfacesInventarios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getInventarios = async (
  filtros: IFiltrosInventarios
): Promise<ApiResponse<IInventarios[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getInventarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros),
    });

    const data: ApiResponse<IInventarios[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los inventarios:', error);
    throw error;
  }
};

export const createInventarios = async (
  inventario: IFormInventarios
): Promise<ApiResponse<IFormInventarios[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/createInventarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inventario),
    });

    const data: ApiResponse<IFormInventarios[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Inventarios:', error);
    throw error;
  }
};

export const updateInventarios = async (
  inventario: Partial<IFormInventarios>
): Promise<ApiResponse<IFormInventarios[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/updateInventarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inventario),
    });

    const data: ApiResponse<IFormInventarios[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Inventarios:', error);
    throw error;
  }
};
