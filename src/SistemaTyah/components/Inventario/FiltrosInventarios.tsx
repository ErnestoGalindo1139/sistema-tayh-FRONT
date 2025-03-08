import { Label, Select, Tooltip } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { SearchIcon } from '../../icons/SearchIcon';
import { IApiError } from '../../interfaces/interfacesApi';
import Toast from '../Toast';
import {
  IColores,
  IModelos,
  ITallas,
  ITipoPrendas,
} from '../../interfaces/interfacesPedidos';
import { useInputsInteraction } from '../../hooks/useInputsInteraction';
import {
  IFiltrosInventarios,
  IInventarios,
} from '../../interfaces/interfacesInventarios';
import { getInventarios } from '../../helpers/apiInventarios';
import {
  getColores,
  getModelosCombo,
  getTallas,
  getTipoPrendas,
} from '../../helpers/apiPedidos';

export const FiltrosInventarios = ({
  filtros,
  setFiltros,
  actualizarInventarios,
  setIsLoading,
  onInputChange,
}: {
  filtros: IFiltrosInventarios;
  setFiltros: React.Dispatch<React.SetStateAction<IFiltrosInventarios>>;
  actualizarInventarios: React.Dispatch<React.SetStateAction<IInventarios[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; // El actualizador del estado de carga
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void; // Cambios en inputs
}): React.JSX.Element => {
  const [tipoPrendas, setTipoPrendas] = useState<ITipoPrendas[]>([]);
  const [tallas, setTallas] = useState<ITallas[]>([]);
  const [modelos, setModelos] = useState<IModelos[]>([]);
  const [colores, setColores] = useState<IColores[]>([]);

  const seleccionarTextoInput = useInputsInteraction();

  useEffect(() => {
    const fetchModelos = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const inventariosData = await getInventarios(filtros); // Modulo de Pedidos
        actualizarInventarios(inventariosData.body);
      } catch (error) {
        const errorMessage =
          (error as IApiError).message || 'Ocurrió un error desconocido';
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelos();
  }, []);

  useEffect(() => {
    const fetchModelos = async (): Promise<void> => {
      try {
        const modelosData = await getModelosCombo(filtros.de_Genero); // Modulo de Pedidos
        setModelos(modelosData.body);
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
          id_Modelo: 0,
        });
      }
    };

    fetchModelos();
  }, [filtros.de_Genero]);

  useEffect(() => {
    const fetchTallas = async (): Promise<void> => {
      try {
        const tallasData = await getTallas(); // Modulo de Pedidos
        setTallas(tallasData.body);
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

    fetchTallas();
  }, []);

  useEffect(() => {
    const fetchTipoPrendas = async (): Promise<void> => {
      try {
        const tipoPrendasData = await getTipoPrendas();
        setTipoPrendas(tipoPrendasData.body);
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

    fetchTipoPrendas();
  }, []);

  useEffect(() => {
    const fetchColores = async (): Promise<void> => {
      try {
        const coloresData = await getColores(filtros.de_Genero); // Modulo de Pedidos
        setColores(coloresData.body);
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
          id_Color: 0,
        });
      }
    };

    fetchColores();
  }, [filtros.de_Genero]);

  const buscarInventarios = async (
    filtros: IFiltrosInventarios
  ): Promise<void> => {
    setIsLoading(true);
    const inventariosData = await getInventarios(filtros);

    if (inventariosData.success) {
      actualizarInventarios(inventariosData.body);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      return;
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
              onChange={onInputChange}
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
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Modelo
            </Label>
            <Select
              value={filtros.id_Modelo}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              id="id_Modelo"
              name="id_Modelo"
              onChange={onInputChange}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Seleccione un Modelo
              </option>
              {modelos && modelos.length > 0 ? (
                modelos.map((modelo) => (
                  <option
                    className="dark:text-black"
                    key={modelo.id_Modelo}
                    value={modelo.id_Modelo}
                  >
                    {modelo.de_Modelo}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Tipo Prenda
            </Label>
            <Select
              value={filtros.id_TipoPrenda}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              id="id_TipoPrenda"
              name="id_TipoPrenda"
              onChange={onInputChange}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Seleccione un Tipo de Prenda
              </option>
              {tipoPrendas && tipoPrendas.length > 0 ? (
                tipoPrendas.map((tipoPrenda) => (
                  <option
                    className="dark:text-black"
                    key={tipoPrenda.id_TipoPrenda}
                    value={tipoPrenda.id_TipoPrenda}
                  >
                    {tipoPrenda.de_TipoPrenda}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Talla
            </Label>
            <Select
              value={filtros.id_Talla}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              id="id_Talla"
              name="id_Talla"
              onChange={onInputChange}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Seleccione una Talla
              </option>
              {tallas.map((talla) => (
                <option
                  className="dark:text-black"
                  key={talla.id_Talla}
                  value={talla.id_Talla}
                >
                  {talla.de_Talla}
                </option>
              ))}
            </Select>
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Color
            </Label>
            <Select
              value={filtros.id_Color}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              id="id_Color"
              name="id_Color"
              onChange={onInputChange}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Seleccione un Color
              </option>
              {colores && colores.length > 0 ? (
                colores.map((color) => (
                  <option
                    className="dark:text-black"
                    key={color.id_Color}
                    value={color.id_Color}
                  >
                    {color.de_ColorTela}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
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
              onClick={() => buscarInventarios(filtros)}
            />
          </Tooltip>
        </div>
      </fieldset>
    </div>
  );
};
