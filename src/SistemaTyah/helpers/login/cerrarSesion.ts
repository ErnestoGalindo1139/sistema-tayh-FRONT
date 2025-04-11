import { ApiResponse } from '../../interfaces/interfacesApi';

const BASE_URL = import.meta.env.VITE_API_URL;

// Cerrar sesión
export const cerrarSesion = async (
  id_Usuario: Partial<{ id_Usuario: number }>
): Promise<ApiResponse<object>> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...id_Usuario }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<{ id_Usuario: number }> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    } else {
      localStorage.removeItem('token'); // Eliminar el token de acceso del almacenamiento local
    }

    return data;
  } catch (error) {
    console.error('Error al cerrar sesion:', error);
    throw error;
  }
};
