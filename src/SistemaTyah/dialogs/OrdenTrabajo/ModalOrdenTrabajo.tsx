'use client';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { IOrdenesTrabajo } from '../../interfaces/interfacesOrdenTrabajo';
import { Link, useNavigate } from 'react-router-dom';
import { ModalCancelarOrdenTrabajo } from './ModalCancelarOrdenTrabajo';
import { ModalConfirmarIniciarOrdenTrabajo } from './ModalConfirmarIniciarOrdenTrabajo';

interface ModalOrdenTrabajoProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarOrdenesTrabajo: (clientes: IOrdenesTrabajo[]) => void;
  row: IOrdenesTrabajo;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
}

export const ModalOrdenTrabajo = ({
  isOpen,
  onClose,
  actualizarOrdenesTrabajo,
  row,
}: ModalOrdenTrabajoProps): React.JSX.Element => {
  const [isModalIniciarOpen, setIsModalIniciarOpen] = useState(false);
  const navigate = useNavigate();

  const abrirModalCancelarOrdenTrabajo = (): void => {
    openModalCancelar();
  };

  const {
    isOpen: isModalCancelarOpen,
    onOpen: openModalCancelar,
    onClose: closeModalCancelar,
  } = useDisclosure();

  const abrirModalIniciarOrdenTrabajo = (): void => {
    setIsModalIniciarOpen(true);
  };

  const cerrarModalIniciarOrdenTrabajo = (): void => {
    setIsModalIniciarOpen(false);
  };

  const iniciarOrdenTrabajo = (): void => {
    navigate(`/ordentrabajo/${row.id_OrdenTrabajo}`);
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
          maxWidth="600px"
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
            <p>
              Numero de pedido:{' '}
              <span className="font-normal">#{row.id_Pedido}</span>
            </p>
            <p className="text-[2rem]">
              Estatus:{' '}
              <span
                className={`font-normal`}
                style={{ color: row.color_Estatus }}
              >
                {row.de_Estatus}
              </span>
            </p>
            <p>
              Cliente: <span className="font-normal">{row.nb_Cliente}</span>
            </p>
            <p>
              Cantidad Total:{' '}
              <span className="font-normal">{row.nu_Cantidad}</span>
            </p>
            <p>
              Cantidad Pendiente:{' '}
              <span className="font-normal">{row.nu_CantidadPendiente}</span>
            </p>
            <p>
              Fecha de recibido:{' '}
              <span className="font-normal">{row.fh_Registro}</span>
            </p>
            <p>
              Fecha de finalizacion:{' '}
              <span className="font-normal">
                {row.fh_Finalizacion ? row.fh_Finalizacion : 'Sin finalizar'}
              </span>
            </p>
            <p>
              Modelo: <span className="font-normal">{row.de_Modelo}</span>
            </p>
            <p>
              Talla: <span className="font-normal">{row.de_Talla}</span>
            </p>
            <p>
              Genero: <span className="font-normal">{row.de_Genero}</span>
            </p>
            <p>
              Color de tela:{' '}
              <span className={`font-normal`}>{row.de_ColorTela}</span>
            </p>
            <p>
              Comentario de cancelación:{' '}
              <span className={`font-normal`}>
                {row.de_ComentarioCancelacion}
              </span>
            </p>
          </ModalBody>

          <ModalFooter>
            <Button
              hidden={row.id_Estatus != 7 && row.id_Estatus != 8 ? true : false}
              colorScheme="blue"
              mr={3}
              fontSize="3xl"
              size="lg"
              style={{ padding: '2rem' }}
              onClick={abrirModalIniciarOrdenTrabajo}
            >
              Iniciar Orden de Trabajo
            </Button>
            <Button
              hidden={
                row.id_Estatus != 10 && row.id_Estatus != 11 ? false : true
              }
              colorScheme="red"
              mr={3}
              fontSize="3xl"
              size="lg"
              style={{ padding: '2rem' }}
              onClick={abrirModalCancelarOrdenTrabajo}
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

      <ModalCancelarOrdenTrabajo
        isOpen={isModalCancelarOpen}
        onClose={closeModalCancelar}
        row={
          row
            ? row
            : {
                id_OrdenTrabajo: 0,
                de_ColorTela: '',
                nu_Cantidad: 0,
                nu_CantidadPendiente: 0,
                de_Modelo: '',
                de_TipoTela: '',
                de_Talla: '',
                de_Ruta: '',
                id_ModeloPerspectiva: 0,
                totalModeloPerspectiva: 0,
                id_Especificacion: 0,
                nu_Especificacion: 0,
                de_Especificacion: '',
                de_Genero: '',
                id_ModeloImagen: 0,
                sn_ActivoImagen: 0,
                id_Pedido: 0,
              }
        }
        sn_PantallaOrdenTrabajo={false}
        actualizarOrdenesTrabajo={actualizarOrdenesTrabajo}
      />

      <ModalConfirmarIniciarOrdenTrabajo
        isOpen={isModalIniciarOpen}
        onClose={cerrarModalIniciarOrdenTrabajo}
        onConfirm={() => iniciarOrdenTrabajo()}
        objeto="Orden de Trabajo"
      />
    </>
  );
};
