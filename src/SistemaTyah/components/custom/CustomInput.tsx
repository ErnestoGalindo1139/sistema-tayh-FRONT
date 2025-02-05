import { TextInput } from 'flowbite-react';
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string; // Añadiendo className como opcional
  sizing?: string; // Añadiendo sizing como opcional
}

export const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, sizing, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        sizing={sizing}
        className={`dark:text-white ${className}`}
        {...props}
      />
    );
  }
);
