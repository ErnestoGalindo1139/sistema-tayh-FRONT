import { TextInput } from 'flowbite-react';
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string; // Añadiendo className como opcional
  sizing?: string; // Añadiendo sizing como opcional
}

export const CustomInput: React.FC<InputProps> = ({
  className,
  ...props
}: InputProps) => {
  return <TextInput className={`dark:text-white ${className}`} {...props} />;
};
