import { Label, Select, TextInput, Tooltip } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { SearchIcon } from '../../icons/SearchIcon';
import { IFiltrosPrecios, IPrecios } from '../../interfaces/interfacesPrecios';
import { getTallas, getTipoPrendas } from '../../helpers/apiPedidos';
import { IApiError } from '../../interfaces/interfacesApi';
import Toast from '../Toast';
import { ITallas, ITipoPrendas } from '../../interfaces/interfacesPedidos';
import { getPrecios } from '../../helpers/apiPrecios';

export const FiltrosPrecios = ({
  filtros,
  setFiltros,
  actualizarPrecios,
  setIsLoading,
}: {
  filtros: IFiltrosPrecios;
  setFiltros: React.Dispatch<React.SetStateAction<IFiltrosPrecios>>;
  actualizarPrecios: React.Dispatch<React.SetStateAction<IPrecios[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; // El actualizador del estado de carga
}): React.JSX.Element => {
  const [tipoPrendas, setTipoPrendas] = useState<ITipoPrendas[]>([]);
  const [tallas, setTallas] = useState<ITallas[]>([]);

  useEffect(() => {
    const fetchPrecios = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const preciosData = await getPrecios(filtros);
        actualizarPrecios(preciosData.body);
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

    fetchPrecios();
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

  const buscarPrecios = async (filtros: IFiltrosPrecios): Promise<void> => {
    setIsLoading(true);
    const preciosData = await getPrecios(filtros);

    if (preciosData.success) {
      actualizarPrecios(preciosData.body);
      setIsLoading(false);
    } else {
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
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Tipo Prenda
            </Label>
            <Select
              value={filtros.id_TipoPrenda}
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              id="id_TipoPrenda"
              name="id_TipoPrenda"
              onChange={(e) => {
                setFiltros({
                  ...filtros,
                  id_TipoPrenda: Number(e.target.value),
                });
                // calcularPrecioUnitario();
              }}
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
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  id_Talla: Number(e.target.value),
                })
              }
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
            <Label className="text-[1.6rem] font-bold">Precio Minimo</Label>
            <TextInput
              type="number"
              placeholder="Precio Minimo"
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              value={filtros.im_PrecioMinimo}
              id="im_PrecioMinimo"
              name="im_PrecioMinimo"
              addon="$"
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  im_PrecioMinimo: Number(e.target.value),
                })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#FFFFFF',
              }}
              sizing="lg"
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Precio Maximo</Label>
            <TextInput
              type="number"
              placeholder="Precio Maximo"
              className={`dark:text-white mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              value={filtros.im_PrecioMaximo}
              id="im_PrecioMaximo"
              name="im_PrecioMaximo"
              addon="$"
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  im_PrecioMaximo: Number(e.target.value),
                })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#FFFFFF',
              }}
              sizing="lg"
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
              onClick={() => buscarPrecios(filtros)}
            />
          </Tooltip>
        </div>
      </fieldset>
    </div>
  );
};
