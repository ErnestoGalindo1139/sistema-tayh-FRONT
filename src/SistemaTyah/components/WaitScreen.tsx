// WaitScreen.tsx
import React from 'react';

interface WaitScreenProps {
  message?: string; // Prop opcional para el mensaje
}

export const WaitScreen: React.FC<WaitScreenProps> = ({
  message = 'Cargando, por favor espera...',
}) => {
  return (
    <div className="wait-screen">
      <div className="wait-content">
        <div className="spinner"></div>
        <p className="text-[1.6rem]">{message}</p>
      </div>
    </div>
  );
};
