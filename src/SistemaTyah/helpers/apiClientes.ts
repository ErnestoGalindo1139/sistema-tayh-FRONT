import {
  ApiResponse,
  IClientes,
  IFormClientes,
} from '../interfaces/interfaces';

const BASE_URL = 'http://localhost:3000';

// Obtener categorias
export const getClientes = async (
  filtros: Partial<IClientes>
): Promise<ApiResponse<IClientes[]>> => {
  console.log(filtros);

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
  cliente: Partial<IFormClientes>
): Promise<ApiResponse<IFormClientes>> => {
  try {
    const response = await fetch(`${BASE_URL}/deleteClientes`, {
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
    console.error('Error al activar / desactivar cliente:', error);
    throw error;
  }
};
