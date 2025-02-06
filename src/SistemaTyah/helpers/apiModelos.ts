import { ApiResponse } from '../interfaces/interfacesApi';
import { IFiltrosModelos, IFormModelos } from '../interfaces/interfacesModelos';
import { IModelos } from '../interfaces/interfacesPedidos';

const BASE_URL = 'http://localhost:3000';

export const getModelos = async (
  filtros: IFiltrosModelos
): Promise<ApiResponse<IModelos[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getModelos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros),
    });

    const data: ApiResponse<IModelos[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Modelos:', error);
    throw error;
  }
};

export const createModelos = async (
  modelo: IFormModelos
): Promise<ApiResponse<IFormModelos[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/createModelos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelo),
    });

    const data: ApiResponse<IFormModelos[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Modelos:', error);
    throw error;
  }
};

export const updateModelos = async (
  modelo: Partial<IFormModelos>
): Promise<ApiResponse<IFormModelos[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/updateModelos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelo),
    });

    const data: ApiResponse<IFormModelos[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Modelos:', error);
    throw error;
  }
};
