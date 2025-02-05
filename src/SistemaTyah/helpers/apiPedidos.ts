import { ApiResponse } from '../interfaces/interfacesApi';
import {
  IColores,
  IFiltrosPedidos,
  IFormDetallesPedidos,
  IFormPedidos,
  IModelos,
  IPedidos,
  ITallas,
  ITipoPrendas,
  ITipoTelas,
  IViaContactoCombo,
} from '../interfaces/interfacesPedidos';

// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = 'http://localhost:3000';

// Obtener categorias
export const getPedidos = async (
  filtros: Partial<IFiltrosPedidos>
): Promise<ApiResponse<IPedidos[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getPedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IPedidos[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Clientes:', error);
    throw error;
  }
};

// Crear producto
export const createPedidos = async (
  pedido: IFormPedidos
): Promise<ApiResponse<IFormPedidos>> => {
  try {
    console.log(pedido);
    const response = await fetch(`${BASE_URL}/createPedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });

    const data: ApiResponse<IFormPedidos> = await response.json();

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
export const updatePedidos = async (
  pedido: Partial<IFormPedidos>
): Promise<ApiResponse<IFormPedidos>> => {
  try {
    const response = await fetch(`${BASE_URL}/updatePedidos`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...pedido }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IFormPedidos> = await response.json();

    // if (!data.success) {
    //   throw new Error(data.message);
    // }

    return data; // Devuelve el producto actualizado
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    throw error;
  }
};

// Eliminar (Desactivar) cliente
export const deletePedido = async (
  id_Pedido: string
): Promise<ApiResponse<IPedidos>> => {
  const payload = {
    id_Pedido,
  };

  try {
    const response = await fetch(`${BASE_URL}/deletePedido`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IPedidos> = await response.json();

    // if (!data.success) {
    //   throw new Error(data.message);
    // }

    return data; // Devuelve el producto actualizado
  } catch (error) {
    console.error('Error al activar / desactivar pedido:', error);
    throw error;
  }
};

// Llenar Combos
export const getModelos = async (
  de_Genero: string
): Promise<ApiResponse<IModelos[]>> => {
  const payload = {
    de_Genero: de_Genero,
  };

  try {
    const response = await fetch(`${BASE_URL}/getModelos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse<IModelos[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Modelos:', error);
    throw error;
  }
};

export const getTallas = async (): Promise<ApiResponse<ITallas[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getTallas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<ITallas[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Modelos:', error);
    throw error;
  }
};

export const getColores = async (
  de_Genero: string
): Promise<ApiResponse<IColores[]>> => {
  const payload = {
    de_Genero: de_Genero,
  };
  try {
    const response = await fetch(`${BASE_URL}/getColores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse<IColores[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Colores:', error);
    throw error;
  }
};

export const getTipoTelas = async (): Promise<ApiResponse<ITipoTelas[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getTipoTelas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<ITipoTelas[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Tipo Telas:', error);
    throw error;
  }
};

export const getTipoPrendas = async (): Promise<
  ApiResponse<ITipoPrendas[]>
> => {
  try {
    const response = await fetch(`${BASE_URL}/getTipoPrendas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<ITipoPrendas[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Tipo Prendas:', error);
    throw error;
  }
};

export const getIdPedido = async (
  payload: Partial<IFormPedidos>
): Promise<ApiResponse<number>> => {
  console.log(payload);

  try {
    const response = await fetch(`${BASE_URL}/getIdPedido`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), // Mandar los filtros en la petición
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Clientes:', error);
    throw error;
  }
};

export const getViasContactoCombo = async (): Promise<
  ApiResponse<IViaContactoCombo[]>
> => {
  try {
    const response = await fetch(`${BASE_URL}/getViasContacto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<IViaContactoCombo[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener Modelos:', error);
    throw error;
  }
};
