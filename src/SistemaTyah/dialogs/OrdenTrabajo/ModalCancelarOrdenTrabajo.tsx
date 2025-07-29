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
import {
  IEspecificacionesOrdenTrabajo,
  IFormCancelarOrdenTrabajo,
  IOrdenesTrabajo,
} from '../../interfaces/interfacesOrdenTrabajo';
import { useNavigate } from 'react-router-dom';
import { Textarea } from 'flowbite-react';
import Toast from '../../components/Toast';
import { ModalConfirmarCancelarOrdenTrabajo } from './ModalConfirmarCancelarOrdenTrabajo';
import { cancelarOrdenTrabajoHelper } from '../../helpers/ordenTrabajo/cancelarOrdenTrabajoHelper';
import { buscarOrdenesTrabajoHelper } from '../../helpers/ordenTrabajo/buscarOrdenesTrabajoHelper';

interface ModalCancelarOrdenTrabajoProps {
  isOpen: boolean;
  onClose: () => void;
  row: IEspecificacionesOrdenTrabajo | IOrdenesTrabajo;
  sn_PantallaOrdenTrabajo: boolean;
  actualizarOrdenesTrabajo?: (ordenesTrabajo: IOrdenesTrabajo[]) => void;
}

export const ModalCancelarOrdenTrabajo = ({
  isOpen,
  onClose,
  row,
  sn_PantallaOrdenTrabajo,
  actualizarOrdenesTrabajo,
}: ModalCancelarOrdenTrabajoProps): React.JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comentarioCancelacionValido, setComentarioCancelacionValido] =
    useState(true);

  const de_ComentarioCancelacionRef = useRef<HTMLTextAreaElement>(null);

  const abrirModalCancelarOrdenTrabajo = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalCancelarOrdenTrabajo = (): void => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const { formState, setFormState, onInputChange, onResetForm } = useForm<{
    de_ComentarioCancelacion: string;
  }>({
    de_ComentarioCancelacion: '',
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
    if (formState.de_ComentarioCancelacion === '') {
      if (
        !validarCampo(
          formState.de_ComentarioCancelacion,
          de_ComentarioCancelacionRef,
          setComentarioCancelacionValido,
          'Ingrese un comentario'
        )
      ) {
        return;
      }
    }

    abrirModalCancelarOrdenTrabajo();
  };

  const cancelarOrdenTrabajo = async (
    ordenTrabajo: IFormCancelarOrdenTrabajo
  ): Promise<void> => {
    // setIsLoading(true);

    const params = {
      id_OrdenTrabajo: ordenTrabajo.id_OrdenTrabajo,
      id_Pedido: ordenTrabajo.id_Pedido,
      id_DetallePedido: ordenTrabajo.id_DetallePedido,
      de_ComentarioCancelacion: formState.de_ComentarioCancelacion,
    };

    const ordenTrabajoData = await cancelarOrdenTrabajoHelper(params);
    if (ordenTrabajoData.success) {
      cerrarModalCancelarOrdenTrabajo();
      onClose();
      if (sn_PantallaOrdenTrabajo) {
        navigate(-1);
      } else {
        const filtros = {
          fh_Inicio: '',
          fh_Fin: '',
        };

        const ordenesTrabajoData = await buscarOrdenesTrabajoHelper(filtros);
        if (ordenesTrabajoData.success) {
          if (actualizarOrdenesTrabajo) {
            actualizarOrdenesTrabajo(ordenesTrabajoData.body);
          }
        } else {
          if (actualizarOrdenesTrabajo) {
            actualizarOrdenesTrabajo([]);
          }
          return;
        }
      }
    } else {
      return;
    }
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
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent
          maxWidth="800px"
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
            <div>
              <label htmlFor="comentarioCancelacion" className="text-[2.1rem]">
                Comentario de cancelacion:
              </label>
              <Textarea
                id="de_ComentarioCancelacion"
                placeholder="Escribe un comentario"
                required
                rows={6}
                className={`text-[1.8rem] font-normal leading-[2.2rem] focus:outline-none focus:ring-1 focus:${comentarioCancelacionValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                name="de_ComentarioCancelacion"
                onChange={onInputChange}
                ref={de_ComentarioCancelacionRef}
                color={`${comentarioCancelacionValido ? '' : 'failure'}`}
                onBlur={() => setComentarioCancelacionValido(true)}
              ></Textarea>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              fontSize="3xl"
              size="lg"
              style={{ padding: '2rem' }}
              onClick={validarDatosFormulario}
            >
              Cancelar
            </Button>
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

      <ModalConfirmarCancelarOrdenTrabajo
        isOpen={isModalOpen}
        onClose={cerrarModalCancelarOrdenTrabajo}
        onConfirm={() =>
          cancelarOrdenTrabajo({
            id_OrdenTrabajo: row.id_OrdenTrabajo,
            id_Pedido: row.id_Pedido,
            id_DetallePedido: row.id_DetallePedido,
            de_ComentarioCancelacion: formState.de_ComentarioCancelacion,
          })
        }
        objeto="Orden de Trabajo"
      />
    </>
  );
};
