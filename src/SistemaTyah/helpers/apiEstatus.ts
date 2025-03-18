import { ApiResponse } from '../interfaces/interfacesApi';
import {
  IEstatus,
  IEstatusComboMultiSelect,
} from '../interfaces/interfacesEstatus';
import { CustomSelectValue } from '../interfaces/interfacesGlobales';

const BASE_URL = import.meta.env.VITE_API_URL;

// Obtener categorias
export const getEstatus = async (
  modulo: number | string
): Promise<ApiResponse<IEstatus[]>> => {
  const payload = {
    id_modulo: modulo,
  };

  try {
    const response = await fetch(`${BASE_URL}/getEstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IEstatus[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Clientes:', error);
    throw error;
  }
};

// Obtener estatus combo multi select
export const getEstatusComboMultiSelect = async (
  filtros?: Partial<IEstatusComboMultiSelect>
): Promise<ApiResponse<CustomSelectValue[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getEstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IEstatusComboMultiSelect[]> = await response.json();

    const comboEstatusMultiSelect = data.body.map(
      (estatus: IEstatusComboMultiSelect) => {
        // Asegurarse de que `id_Estatus` sea siempre un número, o un string si lo prefieres
        const value = estatus.id_Estatus ?? 0; // Asigna 0 si `id_Estatus` es `undefined`
        return {
          value:
            typeof value === 'number' || !isNaN(Number(value))
              ? Number(value)
              : 0, // Asegúrate de convertir el valor a un número si es posible
          label: estatus.de_Estatus || 'Estatus desconocido', // Asegúrate de que `label` siempre tenga un valor
        };
      }
    );

    return {
      message: 'Success',
      success: true,
      body: comboEstatusMultiSelect,
    };
  } catch (error) {
    console.error('Error al obtener el combo de estatus:', error);
    throw error;
  }
};
