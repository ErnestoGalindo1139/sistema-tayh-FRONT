import { Label, Select, TextInput, Tooltip } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { SearchIcon } from '../../icons/SearchIcon';
import { IApiError } from '../../interfaces/interfacesApi';
import Toast from '../Toast';
import {
  IModelos,
  ITallas,
  ITipoPrendas,
} from '../../interfaces/interfacesPedidos';
import { IFiltrosModelos } from '../../interfaces/interfacesModelos';
import { getModelos } from '../../helpers/apiModelos';

export const FiltrosModelos = ({
  filtros,
  setFiltros,
  actualizarModelos,
  setIsLoading,
}: {
  filtros: IFiltrosModelos;
  setFiltros: React.Dispatch<React.SetStateAction<IFiltrosModelos>>;
  actualizarModelos: React.Dispatch<React.SetStateAction<IModelos[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; // El actualizador del estado de carga
}): React.JSX.Element => {
  const id_ModeloRef = useRef<HTMLInputElement>(null);
  const de_GeneroRef = useRef<HTMLInputElement>(null);
  const de_ModeloRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchModelos = async (): Promise<void> => {
      try {
        const modelosData = await getModelos(filtros); // Modulo de Pedidos
        actualizarModelos(modelosData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      } finally {
        setFiltros({
          ...filtros,
          id_Modelo: '',
        });
      }
    };

    fetchModelos();
  }, []);

  const buscarModelos = async (filtros: IFiltrosModelos): Promise<void> => {
    setIsLoading(true);
    const modelosData = await getModelos(filtros);

    if (modelosData.success) {
      actualizarModelos(modelosData.body);
      setIsLoading(false);
    } else {
      return;
    }
  };

  const seleccionarTextoInput = (
    ref: React.RefObject<HTMLInputElement>
  ): void => {
    if (ref.current && ref.current.value === '0') {
      ref.current.select();
    }
  };

  return (
    <div className="filtros">
      <fieldset className="filtros-fieldset dark:bg-[#020405]">
        <legend className="filtros-legend dark:text-white">
          &nbsp;&nbsp;Filtros&nbsp;&nbsp;
        </legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-[2.5rem]">
          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Genero
            </Label>
            <Select
              value={filtros.de_Genero}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              id="de_Genero"
              name="de_Genero"
              onChange={(e) =>
                setFiltros({ ...filtros, de_Genero: e.target.value })
              }
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
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
            <Label className="text-[1.6rem] font-bold">ID Modelo</Label>
            <TextInput
              ref={id_ModeloRef}
              type="text"
              placeholder="Id del Modelo"
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              value={filtros.id_Modelo}
              onChange={(e) =>
                setFiltros({ ...filtros, id_Modelo: e.target.value })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
              sizing="lg"
              onFocus={() => seleccionarTextoInput(id_ModeloRef)}
            />
          </div>
          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Modelo</Label>
            <TextInput
              ref={de_ModeloRef}
              type="text"
              placeholder="Modelo"
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              value={filtros.de_Modelo}
              onChange={(e) =>
                setFiltros({ ...filtros, de_Modelo: e.target.value })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
              sizing="lg"
              onFocus={() => seleccionarTextoInput(de_ModeloRef)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-[2rem]">
          <Tooltip
            content="Buscar"
            className="text-[1.3rem]"
            placement="bottom"
          >
            <SearchIcon
              className="text-[#1769d8] text-[1.8rem] cursor-pointer"
              onClick={() => buscarModelos(filtros)}
            />
          </Tooltip>
        </div>
      </fieldset>
    </div>
  );
};
