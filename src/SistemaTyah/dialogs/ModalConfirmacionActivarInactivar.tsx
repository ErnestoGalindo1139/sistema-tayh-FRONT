// ModalConfirmacion.tsx
import React from 'react';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  descripcion: string;
  objeto: string;
  activo: boolean;
}

export const ModalConfirmacionActivarInactivar = ({
  isOpen,
  onClose,
  onConfirm,
  descripcion,
  objeto,
  activo,
}: ModalConfirmacionProps): React.JSX.Element => {
  return (
    <Modal show={isOpen} popup onClose={onClose} className="z-[500]" size="2xl">
      <Modal.Header>
        <p className="text-gray-700 text-[2rem] m-[1rem]">
          {activo ? 'Desactivar' : 'Activar'} {objeto}
        </p>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-gray-200" />
          <p className="text-gray-700 text-[2rem] p-4">
            ¿Estás seguro de que deseas {activo ? 'desactivar' : 'activar'} a
            <b> "{descripcion}" </b>?
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-2">
        <Button color="failure" onClick={onConfirm} size="xl">
          <p className="text-[1.5rem]">Aceptar</p>
        </Button>
        <Button color="gray" onClick={onClose} size="xl">
          <p className="text-[1.5rem]">Cancelar</p>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
