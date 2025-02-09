import { Label, Select, TextInput, Tooltip } from 'flowbite-react';
import React, { useRef } from 'react';
import { mesesData } from '../../data/mesesData';
import { SearchIcon } from '../../icons/SearchIcon';
import {
  IClientes,
  IFiltrosClientes,
} from '../../interfaces/interfacesClientes';
import { getClientes } from '../../helpers/apiClientes';
import { useInputsInteraction } from '../../hooks/useInputsInteraction';

export const FiltrosClientes = ({
  filtros,
  setFiltros,
  actualizarClientes,
  setIsLoading,
}: {
  filtros: IFiltrosClientes;
  setFiltros: React.Dispatch<React.SetStateAction<IFiltrosClientes>>;
  actualizarClientes: React.Dispatch<React.SetStateAction<IClientes[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; // El actualizador del estado de carga
}): React.JSX.Element => {
  const id_ClienteRef = useRef<HTMLInputElement>(null);
  const nb_ClienteRef = useRef<HTMLInputElement>(null);

  const seleccionarTextoInput = useInputsInteraction();

  const buscarClientes = async (filtros: IFiltrosClientes): Promise<void> => {
    setIsLoading(true);
    const clientesData = await getClientes(filtros);
    actualizarClientes(clientesData.body);
    setIsLoading(false);
  };

  return (
    <div className="filtros">
      <fieldset className="filtros-fieldset dark:bg-[#020405]">
        <legend className="filtros-legend dark:text-white">
          &nbsp;&nbsp;Filtros&nbsp;&nbsp;
        </legend>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-y-4 gap-x-[2.5rem]">
          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Folio</Label>
            <TextInput
              ref={id_ClienteRef}
              type="text"
              placeholder="Folio del Cliente"
              className="dark:text-white text-[1.4rem]"
              value={filtros.id_Cliente}
              onChange={(e) =>
                setFiltros({ ...filtros, id_Cliente: e.target.value })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
              sizing="lg"
              onFocus={() => seleccionarTextoInput(id_ClienteRef)}
            />
          </div>
          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Nombre</Label>
            <TextInput
              ref={nb_ClienteRef}
              type="text"
              placeholder="Nombre del Cliente"
              className="dark:text-white"
              value={filtros.nb_Cliente}
              onChange={(e) =>
                setFiltros({ ...filtros, nb_Cliente: e.target.value })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
              sizing="lg"
              onFocus={() => seleccionarTextoInput(nb_ClienteRef)}
            />
          </div>
          <div>
            <Label className="text-[1.6rem] dark:text-white font-bold">
              Mes Cumpleaños
            </Label>

            <Select
              value={filtros.fh_Cumpleanos}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  fh_Cumpleanos: e.target.value,
                })
              }
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="">Todos</option>
              {mesesData.map((mes) => (
                <option key={mes.id} value={mes.id}>
                  {mes.texto}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Estatus
            </Label>
            <Select
              value={
                filtros.sn_Activo === null ? '' : filtros.sn_Activo ? '1' : '0'
              }
              className="dark:text-white"
              onChange={(e) => {
                const value = e.target.value;
                setFiltros({
                  ...filtros,
                  sn_Activo: value === '' ? null : value === '1',
                });
              }}
              sizing="lg"
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
            >
              <option className="dark:text-black" value="">
                Todos
              </option>
              <option className="dark:text-black" value="1">
                Activo
              </option>
              <option className="dark:text-black" value="0">
                Inactivo
              </option>
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
              onClick={() => buscarClientes(filtros)}
            />
          </Tooltip>
        </div>
      </fieldset>
    </div>
  );
};
