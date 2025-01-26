import React from 'react';
import { IFiltrosPedidos, IPedidos } from '../../interfaces/interfacesPedidos';
import { IEstatus } from '../../interfaces/interfacesEstatus';
import { Datepicker, Label, Select, TextInput, Tooltip } from 'flowbite-react';
import { customDatePickerTheme } from '../../themes/customDatePickerTheme';
import { SearchIcon } from '../../icons/SearchIcon';
import { buscarPedidosHelper } from '../../helpers/pedidos/buscarPedidosHelper';

export const FiltrosPedidos = ({
  filtros,
  setFiltros,
  estatusPedidos,
  actualizarPedidos,
  setIsLoading,
}: {
  filtros: IFiltrosPedidos;
  setFiltros: React.Dispatch<React.SetStateAction<IFiltrosPedidos>>;
  estatusPedidos: IEstatus[];
  actualizarPedidos: React.Dispatch<React.SetStateAction<IPedidos[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; // El actualizador del estado de carga
}): React.JSX.Element => {
  // Convertir el string de fecha 'yyyy-MM-dd' a un objeto Date antes de pasarlo al Datepicker
  const getDateForPicker = (dateString: string): Date | null => {
    if (!dateString) return null; // Si no hay valor, retorna null
    const [year, month, day] = dateString.split('-');
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + 1)); // Convertir string 'yyyy-MM-dd' a un objeto Date ajustado a UTC
  };

  const handleDateChange = (date: Date | null, fieldName: string): void => {
    if (date) {
      // Ajusta la fecha para evitar el desfase de zona horaria (mantener en zona local)
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      ); // Ajuste de zona horaria

      // Convierte la fecha a formato 'yyyy-MM-dd'
      const formattedDate = localDate.toISOString().split('T')[0];

      // Actualiza el estado del campo correspondiente
      setFiltros({
        ...filtros,
        [fieldName]: formattedDate, // Usa el nombre del campo dinámicamente
      });
    } else {
      setFiltros({
        ...filtros,
        [fieldName]: '', // Si no hay fecha seleccionada, limpia el campo correspondiente
      });
    }
  };

  const buscarPedidos = async (filtros: IFiltrosPedidos): Promise<void> => {
    setIsLoading(true);
    const pedidosData = await buscarPedidosHelper(filtros);

    if (pedidosData.success) {
      actualizarPedidos(pedidosData.body);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-2 gap-x-[2.5rem]">
          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Folio Pedido</Label>
            <TextInput
              type="text"
              placeholder="Folio del Pedido"
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              value={filtros.id_Pedido}
              onChange={(e) =>
                setFiltros({ ...filtros, id_Pedido: e.target.value })
              }
              style={{
                fontSize: '1.4rem',
                border: '1px solid #b9b9b9',
                backgroundColor: '#ffffff',
              }}
              sizing="lg"
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Folio Cliente</Label>
            <TextInput
              type="text"
              placeholder="Folio del Cliente"
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
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
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] font-bold">Nombre Cliente</Label>
            <TextInput
              type="text"
              placeholder="Nombre del Cliente"
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
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
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem] dark:text-white font-semibold">
              Estatus
            </Label>
            <Select
              value={filtros.id_Estatus}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              onChange={(e) => {
                setFiltros({
                  ...filtros,
                  id_Estatus: e.target.value,
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

          <div className="dark:text-white">
            <Label className="text-[1.6rem]">Fecha Pedido</Label>
            <Datepicker
              placeholder="Fecha Pedido"
              id="fh_Pedido"
              name="fh_Pedido"
              value={getDateForPicker(filtros.fh_Pedido)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_Pedido');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
              key={filtros.fh_Pedido || 'fh_Pedido'} // Cambia la clave cuando el valor cambia
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem]">Fecha Envío Producción</Label>
            <Datepicker
              key={filtros.fh_EnvioProduccion || 'fh_EnvioProduccion'} // Cambia la clave cuando el valor cambia
              placeholder="Fecha Envío Producción"
              id="fh_EnvioProduccion"
              name="fh_EnvioProduccion"
              value={getDateForPicker(filtros.fh_EnvioProduccion)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_EnvioProduccion');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem]">Fecha Entrega Estimada</Label>
            <Datepicker
              placeholder="Fecha Entrega Estimada"
              id="fh_EntregaEstimada"
              name="fh_EntregaEstimada"
              value={getDateForPicker(filtros.fh_EntregaEstimada)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_EntregaEstimada');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
              key={filtros.fh_EntregaEstimada || 'fh_EntregaEstimada'} // Cambia la clave cuando el valor cambia
            />
          </div>
        </div>

        <div className="flex justify-end mt-[1rem]">
          <Tooltip
            content="Buscar"
            className="text-[1.3rem]"
            placement="bottom"
          >
            <SearchIcon
              className="text-[#1769d8] text-[1.8rem] cursor-pointer"
              onClick={() => buscarPedidos(filtros)}
            />
          </Tooltip>
        </div>
      </fieldset>
    </div>
  );
};
