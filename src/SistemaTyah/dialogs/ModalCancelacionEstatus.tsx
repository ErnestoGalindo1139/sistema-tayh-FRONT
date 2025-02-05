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
  estatusActivo: boolean;
}

export const ModalCancelacionEstatus = ({
  isOpen,
  onClose,
  onConfirm,
  descripcion,
  objeto,
  estatusActivo,
}: ModalConfirmacionProps): React.JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={'4xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader style={{ fontSize: '3rem' }}>
          {' '}
          {!estatusActivo ? 'Reactivar' : 'Cancelar'} {objeto}
        </ModalHeader>
        <ModalCloseButton size={'lg'} />
        <ModalBody>
          <Text style={{ fontSize: '2rem' }}>
            ¿Estás seguro de que deseas{' '}
            {!estatusActivo ? 'Reactivar' : 'Cancelar'} "{descripcion}"?
          </Text>
        </ModalBody>
        <ModalFooter className="flex gap-2">
          <Button
            colorScheme="red"
            onClick={onConfirm}
            style={{ fontSize: '1.8rem' }}
            size={'lg'}
          >
            Aceptar
          </Button>
          <Button onClick={onClose} style={{ fontSize: '1.8rem' }} size={'lg'}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
