/* eslint-disable react-hooks/exhaustive-deps */
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
import Toast from '../components/Toast';
import { WaitScreen } from '../components/WaitScreen';
import { Label, Select, TextInput } from 'flowbite-react';
import { ModalConfirmacionAgregar } from './ModalConfirmacionAgregar';
import { IModelos } from '../interfaces/interfacesPedidos';

import { IFiltrosModelos, IFormModelos } from '../interfaces/interfacesModelos';
import {
  createModelos,
  getModelos,
  updateModelos,
} from '../helpers/apiModelos';
import { useForm } from '../hooks/useForm';
import { useValidations } from '../hooks/useValidations';
import { useInputsInteraction } from '../hooks/useInputsInteraction';

interface ModalModelosAgregarProps {
  isOpen: boolean;
  onClose: () => void;
  actualizarModelos: (modelos: IModelos[]) => void;
  row: IFormModelos;
  sn_Editar: boolean;
  sn_Visualizar: boolean;
  filtros: IFiltrosModelos;
}

export const ModalModelosAgregar = ({
  isOpen,
  onClose,
  actualizarModelos,
  row,
  sn_Editar,
  sn_Visualizar,
  filtros,
}: ModalModelosAgregarProps): React.JSX.Element => {
  // Referencias para los inputs
  const de_GeneroRef = useRef<HTMLSelectElement>(null);
  const de_ModeloRef = useRef<HTMLInputElement>(null);

  // Manejar Validaciones para los Iputs
  const [generoValido, setGeneroValido] = useState(true);
  const [modeloValido, setModeloValido] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cerrarFormulario, setCerrarFormulario] = useState(false);

  const {
    formState: formModelos,
    setFormState: setFormModelos,
    onInputChange,
    onResetForm: limpiarFormulario,
  } = useForm<IFormModelos>({
    id_Modelo: '',
    de_Genero: '',
    de_Modelo: '',
  });

  // Hook para manejar todas las validaciones generales
  const { validarCampo } = useValidations();

  const seleccionarTextoInput = useInputsInteraction();

  const [isLoading, setIsLoading] = useState(false);

  // Limpiar Formulario
  useEffect(() => {
    if (isOpen) {
      limpiarFormulario();
      setFormModelos({
        ...row,
      });
    }
  }, [isOpen, row]);

  const abrirModalConfirmacion = (): void => {
    setIsModalOpen(true);
  };

  const cerrarModalConfirmacion = (): void => {
    setIsModalOpen(false);
  };

  const guardarModelo = async (): Promise<void> => {
    const payload = {
      ...formModelos,
    };

    setIsLoading(true);

    let response;

    try {
      if (sn_Editar) {
        // Si es editar, llama a updateModelos
        response = await updateModelos(payload);
      } else {
        // Si es crear, llama a createModelos
        response = await createModelos(payload);
      }

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

      // Actualizar los clientes
      const clientesData = await getModelos(filtros);
      actualizarModelos(clientesData.body);
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
      cerrarModalConfirmacion();

      if (response?.success) {
        if (cerrarFormulario) {
          onClose(); // Cierra el modal o limpia el formulario
        }
        const modelosData = await getModelos(filtros);
        actualizarModelos(modelosData.body);
      }
    }
  };

  const validarDatosFormulario = (cerrarForm: boolean = true): void => {
    if (
      !validarCampo(
        formModelos.de_Genero,
        de_GeneroRef,
        setGeneroValido,
        'Genero'
      ) ||
      !validarCampo(
        formModelos.de_Modelo,
        de_ModeloRef,
        setModeloValido,
        'Modelo'
      )
    ) {
      return;
    }

    setCerrarFormulario(cerrarForm);
    abrirModalConfirmacion();
  };

  return (
    <>
      {isLoading && <WaitScreen message="Guardando..." />}
      <Modal
        initialFocusRef={de_GeneroRef}
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
          width="35%"
          maxWidth="1200px"
          height="auto"
          className="p-[1rem] mt-[4rem]"
          style={{ marginTop: '4rem' }}
        >
          <ModalHeader fontSize="4xl">
            {sn_Visualizar ? 'Visualizar' : sn_Editar ? 'Editar' : 'Agregar'}{' '}
            Modelo
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl className="grid grid-cols-1 gap-4">
              <div className="dark:text-white">
                <Label className="text-[1.6rem] dark:text-white font-semibold">
                  Genero
                </Label>
                <Select
                  disabled={sn_Visualizar}
                  ref={de_GeneroRef}
                  value={formModelos.de_Genero}
                  color={`${generoValido ? '' : 'failure'}`}
                  className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${generoValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  id="de_Genero"
                  name="de_Genero"
                  onChange={onInputChange}
                  onBlur={() => setGeneroValido(true)}
                  sizing="lg"
                  style={{
                    fontSize: '1.4rem',
                    border: '1px solid #b9b9b9',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option
                    className="dark:text-black"
                    value=""
                    disabled={!!formModelos.de_Genero}
                  >
                    Seleccione el Genero
                  </option>
                  <option className="dark:text-black" value="H">
                    Hombre
                  </option>
                  <option className="dark:text-black" value="M">
                    Mujer
                  </option>
                </Select>
              </div>

              <div className="dark:text-white">
                <Label className="text-[1.6rem] font-bold">
                  Nombre del Modelo
                </Label>
                <TextInput
                  disabled={sn_Visualizar}
                  ref={de_ModeloRef}
                  color={`${modeloValido ? '' : 'failure'}`}
                  type="text"
                  placeholder="Nombre del Modelo"
                  className={`dark:text-white mb-4 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black focus:${modeloValido ? 'ring-[#656ed3e1]' : 'ring-red-500'}`}
                  value={formModelos.de_Modelo}
                  id="de_Modelo"
                  name="de_Modelo"
                  required
                  onChange={onInputChange}
                  style={{
                    fontSize: '1.4rem',
                  }}
                  onBlur={() => setModeloValido(true)}
                  onFocus={() => seleccionarTextoInput(de_ModeloRef)}
                  sizing="lg"
                />
              </div>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              hidden={sn_Editar}
              colorScheme="pink"
              mr={3}
              onClick={() => validarDatosFormulario(false)}
              fontSize="2xl"
              size="lg"
            >
              Guardar y agregar Otro
            </Button>
            <Button
              isDisabled={sn_Visualizar}
              colorScheme="blue"
              mr={3}
              onClick={() => validarDatosFormulario(true)}
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

      <ModalConfirmacionAgregar
        isOpen={isModalOpen}
        onClose={cerrarModalConfirmacion}
        onConfirm={guardarModelo}
        objeto="Modelo"
        sn_editar={sn_Editar}
      />
    </>
  );
};
