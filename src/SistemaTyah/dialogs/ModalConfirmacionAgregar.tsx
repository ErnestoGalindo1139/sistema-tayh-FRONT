import React from 'react';
import { Modal, Button } from 'flowbite-react';

import { HiOutlineExclamationCircle, HiCheckCircle } from 'react-icons/hi';

interface ModalConfirmacionAgregarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  objeto: string;
}

export const ModalConfirmacionAgregar = ({
  isOpen,
  onClose,
  onConfirm,
  objeto,
}: ModalConfirmacionAgregarProps): React.JSX.Element => {
  return (
    <Modal
      show={isOpen}
      size="2xl"
      popup
      onClose={onClose}
      className="z-[9999]"
    >
      <Modal.Header>
        <p className="text-gray-700 text-[2rem] m-[1rem]">Agregar {objeto}</p>
      </Modal.Header>
      <Modal.Body>
        <HiCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-500 dark:text-gray-200" />

        <div className="text-center">
          <p className="text-gray-700 text-[2rem]">
            ¿Está seguro de que desea agregar el {objeto}?
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-2">
        <Button color="success" onClick={onConfirm} size="xl">
          <p className="text-[1.5rem]">Aceptar</p>
        </Button>
        <Button color="light" onClick={onClose} size="xl">
          <p className="text-[1.5rem]">Cancelar</p>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
