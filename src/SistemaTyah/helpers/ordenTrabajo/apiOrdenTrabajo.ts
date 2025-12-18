import { ApiResponse } from '../../interfaces/interfacesApi';
import { CustomSelectValue } from '../../interfaces/interfacesGlobales';
import {
  IEspecificacionesOrdenTrabajo,
  IEspecificacionesOrdenTrabajoParams,
  IFiltrosOrdenTrabajo,
  IFormCancelarOrdenTrabajo,
  IFormFinalizarOrdenTrabajo,
  IOrdenesTrabajo,
  IOrdenTrabajoCombo,
  ITemaColorTela,
} from '../../interfaces/interfacesOrdenTrabajo';

const BASE_URL = import.meta.env.VITE_API_URL;

// Obtener ordenes de trabajo
export const getOrdenesTrabajo = async (
  filtros: Partial<IFiltrosOrdenTrabajo>
): Promise<ApiResponse<IOrdenesTrabajo[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getOrdenesTrabajo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IOrdenesTrabajo[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los Envios:', error);
    throw error;
  }
};

// Obtener ordenes de trabajo combo multi select
export const getOrdenesTrabajoComboMultiSelect = async (
  filtros?: Partial<IOrdenTrabajoCombo>
): Promise<ApiResponse<CustomSelectValue[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/getOrdenesTrabajoCombo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros), // Mandar los filtros en la petición
    });

    const data: ApiResponse<IOrdenTrabajoCombo[]> = await response.json();

    const comboClientesMultiSelect = data.body.map(
      (ordenTrabajo: IOrdenTrabajoCombo) => {
        // Asegurarse de que `id_Pedido` sea siempre un número, o un string si lo prefieres
        const value = ordenTrabajo.id_Pedido ?? 0; // Asigna 0 si `id_Cliente` es `undefined`
        return {
          value:
            typeof value === 'number' || !isNaN(Number(value))
              ? Number(value)
              : 0, // Asegúrate de convertir el valor a un número si es posible
          label: ordenTrabajo.de_OrdenTrabajo || 'Orden de trabajo desconocida', // Asegúrate de que `label` siempre tenga un valor
        };
      }
    );

    return {
      message: 'Success',
      success: true,
      body: comboClientesMultiSelect,
    };
  } catch (error) {
    console.error('Error al obtener el combo de ordenes de trabajo:', error);
    throw error;
  }
};

export const getEspecificacionesOrdenTrabajo = async (
  filtros: Partial<IEspecificacionesOrdenTrabajoParams>
): Promise<ApiResponse<IEspecificacionesOrdenTrabajo[]>> => {
  try {
    const response = await fetch(
      `${BASE_URL}/getEspecificacionesOrdenesTrabajo`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros), // Mandar los filtros en la petición
      }
    );

    const data: ApiResponse<IEspecificacionesOrdenTrabajo[]> =
      await response.json();
    return data;
  } catch (error) {
    console.error(
      'Error al obtener Especificaciones de la orden de trabajo:',
      error
    );
    throw error;
  }
};

// Actualizar ordenes trabajo
export const updateFinalizarOrdenesTrabajo = async (
  ordenTrabajo: Partial<IFormFinalizarOrdenTrabajo>
): Promise<ApiResponse<IFormFinalizarOrdenTrabajo>> => {
  if (ordenTrabajo.sn_OrdenFinalizada === 2) {
    ordenTrabajo.sn_OrdenFinalizada = 0;
  }

  try {
    const response = await fetch(`${BASE_URL}/updateFinalizarOrdenTrabajo`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...ordenTrabajo }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IFormFinalizarOrdenTrabajo> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data; // Devuelve el producto actualizado
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Cancelar orden de trabajo
export const cancelarOrdenTrabajo = async (
  ordenTrabajo: Partial<IFormCancelarOrdenTrabajo>
): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${BASE_URL}/cancelarOrdenTrabajo`, {
      method: 'POST', // El método sigue siendo POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...ordenTrabajo }), // Incluye el ID y los datos a actualizar
    });

    const data: ApiResponse<IFormFinalizarOrdenTrabajo> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return {
      message: 'Orden de trabajo cancelada',
      success: true,
      body: undefined,
    };
  } catch (error) {
    console.error('Error al cancelar / reanudar pedido:', error);
    throw error;
  }
};

export const getTemasColorTela = async (): Promise<
  ApiResponse<ITemaColorTela[]>
> => {
  try {
    const response = await fetch(`${BASE_URL}/getTemasColor`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<ITemaColorTela[]> = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error obteniendo temas de color');
    }

    return data;
  } catch (error) {
    console.error('Error al obtener temas de color:', error);
    throw error;
  }
};
