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
import { IOrdenesTrabajo } from '../../interfaces/interfacesOrdenTrabajo';
import { Link } from 'react-router-dom';

interface ModalOrdenTrabajoProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarOrdenTrabajo: (clientes: IOrdenesTrabajo[]) => void;
  row: IOrdenesTrabajo;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
}

export const ModalOrdenTrabajo = ({
  isOpen,
  onClose,
  actualizarOrdenTrabajo,
  row,
}: ModalOrdenTrabajoProps): React.JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

  // const { formState, setFormState, onInputChange, onResetForm } = useForm<{
  //   id_Envio: number;
  //   id_Cliente: number;
  //   de_Direccion: string;
  //   de_CorreoElectronico: string;
  //   nu_TelefonoCelular: string;
  //   nu_TelefonoRedLocal: string;
  //   de_FolioGuia: string;
  //   id_Estatus: number;
  // }>({
  //   id_Envio: 0,
  //   id_Cliente: 0,
  //   de_Direccion: '',
  //   de_CorreoElectronico: '',
  //   nu_TelefonoCelular: '',
  //   nu_TelefonoRedLocal: '',
  //   de_FolioGuia: '',
  //   id_Estatus: 0,
  // });

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
          </ModalBody>

          <ModalFooter>
            <Link to={`/ordentrabajo/${row.id_OrdenTrabajo}`}>
              <Button
                hidden={
                  row.id_Estatus != 7 && row.id_Estatus != 8 ? true : false
                }
                colorScheme="blue"
                mr={3}
                fontSize="3xl"
                size="lg"
                style={{ padding: '2rem' }}
              >
                Iniciar Orden de Trabajo
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
    </>
  );
};
