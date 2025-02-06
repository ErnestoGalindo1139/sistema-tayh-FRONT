import React, { useCallback } from 'react';
import Toast from '../components/Toast';

interface UseValidations {
  validarCorreo: (
    correo: string,
    ref: React.RefObject<HTMLElement>,
    setEstadoValido: React.Dispatch<React.SetStateAction<boolean>>,
    campoNombre: string
  ) => boolean;

  validarTelefono: (
    numero: string,
    ref: React.RefObject<HTMLElement>,
    setEstadoValido: React.Dispatch<React.SetStateAction<boolean>>,
    campoNombre: string
  ) => boolean;

  validarCampo: (
    campo: string | number,
    ref: React.RefObject<HTMLElement>,
    setValido: React.Dispatch<React.SetStateAction<boolean>>,
    campoNombre: string
  ) => boolean;

  validarNumeroNegativo: (
    numero: string | number,
    ref: React.RefObject<HTMLElement>,
    setValido: React.Dispatch<React.SetStateAction<boolean>>,
    campoNombre: string
  ) => boolean;

  validarRangoFechas: (
    fechaInicio: Date | string,
    fechaFin: Date | string,
    refInicio: React.RefObject<HTMLElement>,
    refFin: React.RefObject<HTMLElement>,
    setValido: React.Dispatch<React.SetStateAction<boolean>>,
    nombreFechaInicio: string,
    nombreFechaFin: string
  ) => boolean;
}

export const useValidations = (): UseValidations => {
  const validarCorreo = useCallback<UseValidations['validarCorreo']>(
    (correo, ref, setEstadoValido, campoNombre) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        ref.current?.focus();
        setEstadoValido(false);
        Toast.fire({
          icon: 'error',
          title: `${campoNombre} Inválido`,
          text: `Por favor ingrese un correo válido.`,
        });
        return false;
      }
      setEstadoValido(true);
      return true;
    },
    []
  );

  const validarTelefono = useCallback<UseValidations['validarTelefono']>(
    (numero, ref, setEstadoValido, campoNombre) => {
      const telefonoRegex = /^[0-9]{7,15}$/;
      if (!telefonoRegex.test(numero)) {
        ref.current?.focus();
        setEstadoValido(false);
        Toast.fire({
          icon: 'error',
          title: `${campoNombre} Inválido`,
          text: `Por favor ingrese un teléfono válido.`,
        });
        return false;
      }
      setEstadoValido(true);
      return true;
    },
    []
  );

  const validarCampo = useCallback<UseValidations['validarCampo']>(
    (campo, ref, setValido, campoNombre) => {
      if (!campo) {
        ref.current?.focus();
        setValido(false);
        Toast.fire({
          icon: 'error',
          title: `${campoNombre} es obligatorio`,
          text: `Por favor completa el campo ${campoNombre}.`,
        });
        return false;
      }
      setValido(true);
      return true;
    },
    []
  );

  const validarNumeroNegativo = useCallback<
    UseValidations['validarNumeroNegativo']
  >((numero, ref, setValido, campoNombre) => {
    const valor = Number(numero);
    if (isNaN(valor)) {
      ref.current?.focus();
      setValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoNombre} no es un número válido`,
        text: `Por favor ingresa un valor numérico en ${campoNombre}.`,
      });
      return false;
    }

    if (valor == 0) {
      ref.current?.focus();
      setValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoNombre} no puede ser 0`,
        text: `Por favor ingresa una cantidad válida.`,
      });
      return false;
    }

    if (valor < 0) {
      ref.current?.focus();
      setValido(false);
      Toast.fire({
        icon: 'error',
        title: `${campoNombre} no puede ser negativo`,
        text: `Por favor ingresa una cantidad válida.`,
      });
      return false;
    }

    setValido(true);
    return true;
  }, []);

  const validarRangoFechas = useCallback<UseValidations['validarRangoFechas']>(
    (
      fechaInicio,
      fechaFin,
      refInicio,
      refFin,
      setValido,
      nombreFechaInicio,
      nombreFechaFin
    ) => {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        const campoInvalido = isNaN(inicio.getTime())
          ? nombreFechaInicio
          : nombreFechaFin;
        const refInvalido = isNaN(inicio.getTime()) ? refInicio : refFin;

        refInvalido.current?.focus();
        setValido(false);
        Toast.fire({
          icon: 'error',
          title: `${campoInvalido} no es una fecha válida`,
          text: `Por favor selecciona una fecha válida para ${campoInvalido}.`,
        });
        return false;
      }

      if (fin < inicio) {
        refFin.current?.focus();
        setValido(false);
        Toast.fire({
          icon: 'error',
          title: `Rango de fechas no válido`,
          text: `${nombreFechaFin} no puede ser menor que ${nombreFechaInicio}.`,
        });
        return false;
      }

      setValido(true);
      return true;
    },
    []
  );

  return {
    validarCorreo,
    validarTelefono,
    validarCampo,
    validarNumeroNegativo,
    validarRangoFechas,
  };
};
