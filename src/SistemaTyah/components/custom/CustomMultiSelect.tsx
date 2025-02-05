import React from 'react';
import Select, {
  GroupBase,
  Props as SelectProps,
  StylesConfig,
} from 'react-select';
import makeAnimated from 'react-select/animated';
import { CustomSelectValue } from '../../interfaces/interfacesGlobales';

interface CustomSelectProps
  extends SelectProps<CustomSelectValue, true, GroupBase<CustomSelectValue>> {
  className?: string; // Añadiendo className como opcional
}

const animatedComponents = makeAnimated();

// Definir los estilos personalizados
const customStyles: StylesConfig<
  CustomSelectValue,
  true,
  GroupBase<CustomSelectValue>
> = {
  option: (styles, { data, selectProps, isSelected, isFocused }) => {
    if (!Array.isArray(selectProps.options)) return styles; // Validar si options es un array

    // Buscar el índice de la opción actual dentro de `options`
    const index = selectProps.options.findIndex(
      (option) => option.value === data.value
    );

    const isOdd = index % 2 !== 0; // Alternar entre azul y rosa según el índice

    return {
      ...styles,
      backgroundColor: isSelected
        ? isOdd
          ? 'hotpink'
          : 'dodgerblue'
        : isFocused
          ? 'lightgray'
          : 'white',
      color: isSelected ? 'white' : 'black',
      cursor: 'pointer',
      // ':active': {
      //   ...styles[':active'],
      //   backgroundColor: isOdd ? 'hotpink' : 'dodgerblue',
      // },
    };
  },
  multiValue: (styles, { data, selectProps }) => {
    if (!Array.isArray(selectProps.options)) return styles; // Validar si options es un array

    // Obtener índice de la opción actual en el array de opciones
    const index = selectProps.options.findIndex(
      (option) => option.value === data.value
    );

    const isOdd = index % 2 !== 0;
    return {
      ...styles,
      // backgroundColor: isOdd ? '#D17B95' : '#025394',
      backgroundColor: isOdd ? '#EF8CA8' : '#025394',
      color: 'white',
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: 'white',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    ':hover': {
      backgroundColor: 'gray',
      color: 'white',
    },
  }),
};

export const CustomMultiSelect: React.FC<CustomSelectProps> = ({
  options,
  className,
  ...props
}) => {
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={options}
      className={`text-[1.4rem] ${className}`}
      placeholder="Seleccione..."
      styles={customStyles} // Aplicando los estilos personalizados
      {...props}
    />
  );
};
