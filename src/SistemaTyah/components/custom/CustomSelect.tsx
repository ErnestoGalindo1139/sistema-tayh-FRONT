import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string; // Añadiendo className como opcional
}

export const CustomSelect: React.FC<SelectProps> = ({
  className,
  ...props
}) => {
  return (
    <select
      className={`block w-full px-4 py-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-[1.4rem] ${className}`}
      {...props}
    ></select>
  );
};
