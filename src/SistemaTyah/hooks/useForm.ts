import React, { Dispatch, SetStateAction, useState } from 'react';

interface IFormState<T = Record<string, unknown>> {
  formState: T; // Estado actual del formulario
  setFormState: Dispatch<SetStateAction<T>>; // Función para actualizar el estado
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void; // Cambios en inputs
  onResetForm: () => void; // Reinicia el formulario
}

export const useForm = <T extends object>(initialState: T): IFormState<T> => {
  const [formState, setFormState] = useState<T>(initialState);

  const onInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = (): void => {
    setFormState(initialState);
  };

  return {
    ...formState,
    formState,
    setFormState,
    onInputChange,
    onResetForm,
  };
};
