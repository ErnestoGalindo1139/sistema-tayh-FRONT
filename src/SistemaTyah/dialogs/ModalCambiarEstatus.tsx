/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { IFormPedidos, IPedidos } from '../interfaces/interfacesPedidos';
import { IEstatus } from '../interfaces/interfacesEstatus';
import { getEstatus, updateEstatus } from '../helpers/apiEstatus';
import { IApiError } from '../interfaces/interfacesApi';
import Toast from '../components/Toast';
import { Label, Select } from 'flowbite-react';
import { useForm } from '../hooks/useForm';
import { WaitScreen } from '../components/WaitScreen';

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { getPedidos } from '../helpers/apiPedidos';

interface ModalCambiarEstatusProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarPedidos: (pedidos: IPedidos[]) => void;
  row: IFormPedidos;
  id_Modulo: number;
}

export const ModalCambiarEstatus = ({
  isOpen,
  onClose,
  actualizarPedidos,
  row,
  id_Modulo,
}: ModalCambiarEstatusProps): React.JSX.Element => {
  // Llenar los combos
  const [estatusPedidos, setEstatusPedidos] = useState<IEstatus[]>([]);

  const {
    formState: formPedidos,
    setFormState: setFormPedidos,
    onInputChange,
    onResetForm: limpiarFormulario,
  } = useForm<IFormPedidos>({
    ...row,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchEstatusPedidos = async (): Promise<void> => {
        try {
          const estatusData = await getEstatus(id_Modulo); // Modulo de Pedidos
          setEstatusPedidos(estatusData.body);
        } catch (error) {
          const errorMessage =
            (error as IApiError).message || 'Ocurrió un error desconocido';
          Toast.fire({
            icon: 'error',
            title: 'Ocurrió un Error',
            text: errorMessage,
          });
        }
      };
      fetchEstatusPedidos();
      setFormPedidos({
        ...row,
      });
      return;
    }
    setEstatusPedidos([]);
  }, [isOpen]);

  const guardarEstatus = async (): Promise<void> => {
    const payload = {
      ...formPedidos,
    };

    setIsLoading(true);

    try {
      // Si es editar, llama a updateInventarios
      const response = await updateEstatus(payload);

      // Si la respuesta no es exitosa, mostrar un error
      if (!response.success) {
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: response.message,
        });
        return;
      }

      // Mostrar mensaje de éxito
      Toast.fire({
        icon: 'success',
        title: 'Operación exitosa',
        text: response.message,
      });

      onClose();

      // Actualizar los clientes
      const pedidosData = await getPedidos({});
      actualizarPedidos(pedidosData.body);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      Toast.fire({
        icon: 'error',
        title: 'Ocurrió un Error',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <WaitScreen message="Cargando Estatus..." />}
      <Modal
        // initialFocusRef={nb_ClienteRef}
        // finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="scale"
        lockFocusAcrossFrames={true}
        size="w-full"
        closeOnOverlayClick={false}
        closeOnEsc={false}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent
          width="40%"
          maxWidth="1200px"
          height="auto"
          className="p-[1rem] mt-[4rem]"
          style={{ marginTop: '4rem' }}
        >
          <ModalHeader fontSize="4xl">Seleccionar Estatus</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="dark:text-white">
              <Label className="text-[1.6rem] dark:text-white font-semibold">
                Estatus
              </Label>
              <Select
                value={formPedidos.id_Estatus}
                id="id_Estatus"
                name="id_Estatus"
                className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
                onChange={onInputChange}
                sizing="lg"
                style={{
                  fontSize: '1.4rem',
                  border: '1px solid #b9b9b9',
                  backgroundColor: '#ffffff',
                }}
              >
                {estatusPedidos.map((estatus) => (
                  <option
                    className="dark:text-black"
                    key={estatus.id_Estatus}
                    value={estatus.id_Estatus}
                  >
                    {estatus.de_Estatus}
                  </option>
                ))}
              </Select>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={guardarEstatus}
              fontSize="2xl"
              size="lg"
            >
              Guardar
            </Button>
            <Button
              onClick={onClose}
              fontSize="2xl"
              size="lg"
              colorScheme="orange"
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
