'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useForm } from '../../hooks/useForm';
import { IEspecificacionesOrdenTrabajo } from '../../interfaces/interfacesOrdenTrabajo';
import { Link, useNavigate } from 'react-router-dom';
import { CustomInput } from '../../components/custom/CustomInput';
import { Radio } from 'flowbite-react';
import { customRadioButtonTheme } from '../../themes/customRadioButtonTheme';
import Toast from '../../components/Toast';
import { updateFinalizarOrdenesTrabajo } from '../../helpers/ordenTrabajo/apiOrdenTrabajo';
import { ModalConfirmacionFinalizarOrdenTrabajo } from './ModalConfirmacionFinalizarOrdenTrabajo';

interface ModalOrdenTrabajoProps {
  isOpen: boolean;
  onClose: () => void;
  finalizarOrdenTrabajo: (cantidad: number) => void;
  row: IEspecificacionesOrdenTrabajo;
}

export const ModalFinalizarOrdenTrabajo = ({
  isOpen,
  onClose,
  finalizarOrdenTrabajo,
  row,
}: ModalOrdenTrabajoProps): React.JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cantidadPendienteValida, setCantidadPendienteValida] = useState(true);

  const cantidadPendienteRef = useRef<HTMLInputElement>(null);

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const { formState, setFormState, onInputChange, onResetForm } = useForm<{
    nu_CantidadPendiente: number;
    sn_OrdenFinalizada: number | null;
  }>({
    nu_CantidadPendiente: 0,
    sn_OrdenFinalizada: null,
  });

  const validarCampo = (
    campo: string | number,
    ref: React.RefObject<HTMLElement>,
    setValido: React.Dispatch<React.SetStateAction<boolean>>,
    campoNombre: string
  ): boolean => {
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
  };

  const validarDatosFormulario = async (): Promise<void> => {
    if (!formState.sn_OrdenFinalizada || formState.sn_OrdenFinalizada === 0) {
      Toast.fire({
        icon: 'error',
        title: `Seleccionar si se termino la orden es obligatorio`,
        text: `Por favor seleccione si o no.`,
      });
      return;
    }

    if (formState.sn_OrdenFinalizada === 0) {
      if (
        !validarCampo(
          formState.nu_CantidadPendiente,
          cantidadPendienteRef,
          setCantidadPendienteValida,
          'Ingrese una cantidad pendiente'
        )
      ) {
        return;
      }
    }

    abrirModalConfirmacion();
  };

  const handlefinalizarOrdenTrabajo = async (): Promise<void> => {
    if (Number(formState.nu_CantidadPendiente > row.nu_CantidadPendiente)) {
      Toast.fire({
        icon: 'error',
        title: 'Ocurrió un Error',
        text: 'La nueva cantidad pendiente ingresada no puede ser mayor a la ya guardada',
      });
      return;
    }

    const payload = {
      id_OrdenTrabajo: row.id_OrdenTrabajo,
      id_Pedido: row.id_Pedido,
      nu_CantidadPendiente: Number(formState.nu_CantidadPendiente),
      sn_OrdenFinalizada: Number(formState.sn_OrdenFinalizada),
    };

    // setIsLoading(true);

    let response;

    try {
      response = await updateFinalizarOrdenesTrabajo(payload);

      // Si la respuesta no es exitosa, mostrar un error
      if (response && !response.success) {
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: response?.message || 'Operación exitosa',
        });
        return;
      }

      // Mostrar mensaje de éxito
      Toast.fire({
        icon: 'success',
        title: 'Operación exitosa',
        text: response.message,
      });

      navigate(-1);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      Toast.fire({
        icon: 'error',
        title: 'Ocurrió un Error',
        text: errorMessage,
      });
    } finally {
      // setIsLoading(false);
      if (response?.success) {
        onClose(); // Cierra el modal o limpia el formulario
        cerrarModalConfirmacion();
      }
    }
  };

  // Manejador de cambio
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let valorRadioButton;

    if (event.target.value === '1') {
      valorRadioButton = 1;
    } else if (event.target.value === '2') {
      valorRadioButton = 2;
    } else {
      valorRadioButton = 0;
    }

    setFormState({
      ...formState,
      sn_OrdenFinalizada: valorRadioButton,
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="scale"
        lockFocusAcrossFrames={true}
        size="w-full"
      >
        <ModalOverlay />
        <ModalContent
          maxWidth="500px"
          height="auto"
          className="p-[1rem] mt-[4rem]"
          style={{ marginTop: '4rem', borderRadius: '1rem' }}
        >
          <ModalHeader
            fontSize="4xl"
            className="border-b-[.2rem] border-b-slate-300 mb-[2rem]"
          >
            {`Orden de Trabajo: #${row.id_OrdenTrabajo}`}
          </ModalHeader>
          <ModalCloseButton
            style={{
              fontSize: '1.4rem',
              marginTop: '.2rem',
              marginRight: '.2rem',
            }}
          />
          <ModalBody pb={6} className="text-[2rem] font-bold">
            <label className="text-[2.1rem]">
              Cantidad Total:{' '}
              <span className="font-normal text-blue-700">
                {row.nu_Cantidad}
              </span>
            </label>
            <div className="flex flex-col mt-[.2rem]">
              <label className="text-[2.1rem]">
                ¿Se terminó la orden de trabajo?
              </label>
              <div className="flex flex-row gap-[1rem] mt-[.2rem]">
                <div>
                  <label
                    htmlFor="ordenTrabajoFinalizada1"
                    className="pr-2 font-normal"
                  >
                    Si
                  </label>
                  <Radio
                    id="ordenTrabajoFinalizada1"
                    name="ordenTrabajoFinalizada"
                    theme={customRadioButtonTheme}
                    onChange={handleRadioChange} // Maneja el cambio de selección
                    value="1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ordenTrabajoFinalizada2"
                    className="pr-2 font-normal"
                  >
                    No
                  </label>
                  <Radio
                    id="ordenTrabajoFinalizada2"
                    name="ordenTrabajoFinalizada"
                    theme={customRadioButtonTheme}
                    onChange={handleRadioChange} // Maneja el cambio de selección
                    value="2"
                  />
                </div>
              </div>
            </div>
            <div
              className={`mt-[.2rem] ${formState.sn_OrdenFinalizada == 2 ? '' : 'hidden'}`}
            >
              <label className="text-[2.1rem]">Cantida Pendiente:</label>
              <CustomInput
                color={`${cantidadPendienteValida ? '' : 'failure'}`}
                onBlur={() => setCantidadPendienteValida(true)}
                ref={cantidadPendienteRef}
                placeholder="Dirección del Envio"
                required
                type="number"
                autoComplete="off"
                id="nu_CantidadPendiente"
                name="nu_CantidadPendiente"
                value={formState.nu_CantidadPendiente}
                onChange={onInputChange}
                className={`mb-2 w-[14%] rounded-lg py-2 focus:outline-none focus:ring-1 focus:${cantidadPendienteValida ? 'ring-[#656ed3e1]' : 'ring-red-500'} text-black`}
                style={{ fontSize: '1.8rem' }}
                sizing="lg"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Link to={`/ordentrabajo/${row.id_OrdenTrabajo}`}>
              <Button
                colorScheme="blue"
                mr={3}
                fontSize="3xl"
                size="lg"
                style={{ padding: '2rem' }}
                onClick={validarDatosFormulario}
              >
                Guardar
              </Button>
            </Link>
            <Button
              onClick={onClose}
              fontSize="3xl"
              size="lg"
              colorScheme="orange"
              style={{ padding: '2rem' }}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ModalConfirmacionFinalizarOrdenTrabajo
        isOpen={isModalOpen}
        onClose={cerrarModalConfirmacion}
        onConfirm={handlefinalizarOrdenTrabajo}
        objeto="Orden de trabajo"
      />
    </>
  );
};
