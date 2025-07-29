import {
  IClientes,
  IFiltrosClientes,
  IClientesCombo,
  IFormClientes,
  ICumpleanosClientes,
  IClienteInfo,
} from '../interfaces/interfacesClientes';
import { ApiResponse } from '../interfaces/interfacesApi';
import { CustomSelectValue } from '../interfaces/interfacesGlobales';

const BASE_URL = import.meta.env.VITE_API_URL;

// Obtener clientes
export const getClientes = async (
  filtros: Partial<IFiltrosClientes>
): Promise<ApiResponse<IClientes[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getClientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IClientes[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Clientes:', error);
    throw error;
  }
};

// Crear producto
export const createClientes = async (
  cliente: IFormClientes
): Promise<ApiResponse<IFormClientes>> => {
  try {
    const response = await fetch(`${BASE_URL}/createClientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });

    const data: ApiResponse<IFormClientes> = await response.json();

    // if (!data.success) {
    //   throw new Error(data.message);
    // }

    return data; // Devuelve el producto creado
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Actualizar producto
export const updateClientes = async (
  cliente: Partial<IFormClientes>
): Promise<ApiResponse<IFormClientes>> => {
  try {
    const response = await fetch(`${BASE_URL}/updateClientes`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...cliente }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IFormClientes> = await response.json();

    // if (!data.success) {
    //   throw new Error(data.message);
    // }

    return data; // Devuelve el producto actualizado
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Eliminar (Desactivar) cliente
export const deleteClientes = async (
  cliente: Partial<IClientes>
): Promise<ApiResponse<IClientes>> => {
  try {
    const response = await fetch(`${BASE_URL}/deleteClientes`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...cliente }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IClientes> = await response.json();

    // if (!data.success) {
    //   throw new Error(data.message);
    // }

    return data; // Devuelve el producto actualizado
  } catch (error) {
    console.error('Error al activar / desactivar cliente:', error);
    throw error;
  }
};

// Obtener clientes
export const getClientesCombo = async (
  filtros?: Partial<IClientesCombo>
): Promise<ApiResponse<IClientesCombo[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getClientesCombo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IClientesCombo[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener el combo de clientes:', error);
    throw error;
  }
};

// Obtener clientes combo multi select
export const getClientesComboMultiSelect = async (
  filtros?: Partial<IClientesCombo>
): Promise<ApiResponse<CustomSelectValue[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getClientesCombo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IClientesCombo[]> = await response.json();

    const comboClientesMultiSelect = data.body.map(
      (cliente: IClientesCombo) => {
        // Asegurarse de que `id_Cliente` sea siempre un número, o un string si lo prefieres
        const value = cliente.id_Cliente ?? 0; // Asigna 0 si `id_Cliente` es `undefined`
        return {
          value:
            typeof value === 'number' || !isNaN(Number(value))
              ? Number(value)
              : 0, // Asegúrate de convertir el valor a un número si es posible
          label: cliente.nb_Cliente || 'Cliente desconocido', // Asegúrate de que `label` siempre tenga un valor
        };
      }
    );

    return {
      message: 'Success',
      success: true,
      body: comboClientesMultiSelect,
    };
  } catch (error) {
    console.error('Error al obtener el combo de clientes:', error);
    throw error;
  }
};

// Obtener clientes
export const getFechaCumpleanosClientes = async (): Promise<
  ApiResponse<ICumpleanosClientes[]>
> => {
  try {
    const response = await fetch(`${BASE_URL}/getFechaCumpleanosClientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<ICumpleanosClientes[]> = await response.json();
    return data;
  } catch (error) {
    console.error(
      'Error al obtener las fechas de cumpleaños de los clientes',
      error
    );
    throw error;
  }
};

export const getInfoCliente = async (
  filtros: Partial<IFiltrosClientes>
): Promise<ApiResponse<IClienteInfo[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getClienteInfoById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IClienteInfo[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener la info del Cliente:', error);
    throw error;
  }
};
