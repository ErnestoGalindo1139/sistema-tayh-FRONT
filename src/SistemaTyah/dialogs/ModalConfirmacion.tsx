// ModalConfirmacion.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import React from 'react';

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  descripcion: string;
  objeto: string;
  activo: boolean;
}

export const ModalConfirmacion = ({
  isOpen,
  onClose,
  onConfirm,
  descripcion,
  objeto,
  activo,
}: ModalConfirmacionProps): React.JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {' '}
          {!activo ? 'Activar' : 'Desactivar'} {objeto}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            ¿Estás seguro de que deseas {!activo ? 'activar' : 'desactivar'} "
            {descripcion}"?
          </Text>
        </ModalBody>
        <ModalFooter className="flex gap-2">
          <Button colorScheme="red" onClick={onConfirm}>
            Aceptar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
