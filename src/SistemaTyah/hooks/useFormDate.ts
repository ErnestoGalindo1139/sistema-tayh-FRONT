import { Dispatch, SetStateAction } from 'react';

interface IUseFormDate<T> {
  handleDateChange: (date: Date | null, fieldName: keyof T) => void; // Función para manejar cambios en fechas
  getDateForPicker: (dateString: string) => Date | null; // Función para convertir strings a Date
}

export const useFormDate = <T extends object>(
  formState: T, // Estado actual del formulario
  setFormState: Dispatch<SetStateAction<T>> // Función para actualizar el estado
): IUseFormDate<T> => {
  // Maneja el cambio de fecha en un campo específico
  const handleDateChange = (date: Date | null, fieldName: keyof T): void => {
    if (date) {
      // Ajusta la fecha para evitar el desfase de zona horaria (mantener en zona local)
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );

      // Convierte la fecha a formato 'yyyy-MM-dd'
      const formattedDate = localDate.toISOString().split('T')[0];

      // Actualiza el estado del campo correspondiente
      setFormState({
        ...formState,
        [fieldName]: formattedDate, // Usa el nombre del campo dinámicamente
      });
    } else {
      // Si no hay fecha seleccionada, limpia el campo correspondiente
      setFormState({
        ...formState,
        [fieldName]: '',
      });
    }
  };

  // Convierte el string de fecha 'yyyy-MM-dd' a un objeto Date antes de pasarlo al Datepicker
  const getDateForPicker = (dateString: string): Date | null => {
    if (!dateString) return null; // Si no hay valor, retorna null
    const [year, month, day] = dateString.split('-');
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + 1)); // Convertir string 'yyyy-MM-dd' a un objeto Date ajustado a UTC
  };

  return {
    handleDateChange,
    getDateForPicker,
  };
};
