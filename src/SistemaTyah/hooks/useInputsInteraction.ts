import React from 'react';

export const useInputsInteraction = (): ((
  ref: React.RefObject<HTMLInputElement>
) => void) => {
  const seleccionarTextoInput = (
    ref: React.RefObject<HTMLInputElement>
  ): void => {
    if (ref.current) {
      ref.current.select();
    }
  };

  return seleccionarTextoInput;
};
