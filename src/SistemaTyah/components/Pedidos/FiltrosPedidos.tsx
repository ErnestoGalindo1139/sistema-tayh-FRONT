import React from 'react';
import { IFiltrosPedidos, IPedidos } from '../../interfaces/interfacesPedidos';
import { IEstatus } from '../../interfaces/interfacesEstatus';
import { Datepicker, Label, Select, TextInput, Tooltip } from 'flowbite-react';
import { customDatePickerTheme } from '../../themes/customDatePickerTheme';
import { SearchIcon } from '../../icons/SearchIcon';
import { buscarPedidosHelper } from '../../helpers/pedidos/buscarPedidosHelper';
import { useFormDate } from '../../hooks/useFormDate';

export const FiltrosPedidos = ({
  filtros,
  setFiltros,
  estatusPedidos,
  actualizarPedidos,
  setIsLoading,
  onInputChange,
}: {
  filtros: IFiltrosPedidos;
  setFiltros: React.Dispatch<React.SetStateAction<IFiltrosPedidos>>;
  estatusPedidos: IEstatus[];
  actualizarPedidos: React.Dispatch<React.SetStateAction<IPedidos[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; // El actualizador del estado de carga
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void; // Cambios en inputs
}): React.JSX.Element => {
  const { handleDateChange, getDateForPicker } = useFormDate(
    filtros,
    setFiltros
  );

  const buscarPedidos = async (filtros: IFiltrosPedidos): Promise<void> => {
    setIsLoading(true);
    const pedidosData = await buscarPedidosHelper(filtros);
    actualizarPedidos(pedidosData.body);
    setIsLoading(false);
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
              id="id_Pedido"
              name="id_Pedido"
              onChange={onInputChange}
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
              id="id_Cliente"
              name="id_Cliente"
              onChange={onInputChange}
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
              id="nb_Cliente"
              name="nb_Cliente"
              onChange={onInputChange}
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
            <Label className="text-[1.6rem]">Fecha Inicio Pedido</Label>
            <Datepicker
              placeholder="Fecha Inicio Pedido"
              id="fh_InicioPedido"
              name="fh_InicioPedido"
              value={getDateForPicker(filtros.fh_InicioPedido)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_InicioPedido');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
              key={filtros.fh_InicioPedido || 'fh_InicioPedido'} // Cambia la clave cuando el valor cambia
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem]">Fecha Fin Pedido</Label>
            <Datepicker
              placeholder="Fecha Fin Pedido"
              id="fh_FinPedido"
              name="fh_FinPedido"
              value={getDateForPicker(filtros.fh_FinPedido)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_FinPedido');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
              key={filtros.fh_FinPedido || 'fh_FinPedido'} // Cambia la clave cuando el valor cambia
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem]">
              Fecha Inicio Envío Producción
            </Label>
            <Datepicker
              key={
                filtros.fh_InicioEnvioProduccion || 'fh_InicioEnvioProduccion'
              } // Cambia la clave cuando el valor cambia
              placeholder="Fecha Inicio Envío Producción"
              id="fh_InicioEnvioProduccion"
              name="fh_InicioEnvioProduccion"
              value={getDateForPicker(filtros.fh_InicioEnvioProduccion)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_InicioEnvioProduccion');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem]">Fecha Fin Envío Producción</Label>
            <Datepicker
              key={filtros.fh_FinEnvioProduccion || 'fh_FinEnvioProduccion'} // Cambia la clave cuando el valor cambia
              placeholder="Fecha Fin Envío Producción"
              id="fh_FinEnvioProduccion"
              name="fh_FinEnvioProduccion"
              value={getDateForPicker(filtros.fh_FinEnvioProduccion)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_FinEnvioProduccion');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem]">
              Fecha Inicio Entrega Estimada
            </Label>
            <Datepicker
              placeholder="Fecha Inicio Entrega Estimada"
              id="fh_InicioEntregaEstimada"
              name="fh_InicioEntregaEstimada"
              value={getDateForPicker(filtros.fh_InicioEntregaEstimada)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_InicioEntregaEstimada');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
              key={
                filtros.fh_InicioEntregaEstimada || 'fh_InicioEntregaEstimada'
              } // Cambia la clave cuando el valor cambia
            />
          </div>

          <div className="dark:text-white">
            <Label className="text-[1.6rem]">Fecha Fin Entrega Estimada</Label>
            <Datepicker
              placeholder="Fecha Fin Entrega Estimada"
              id="fh_FinEntregaEstimada"
              name="fh_FinEntregaEstimada"
              value={getDateForPicker(filtros.fh_FinEntregaEstimada)} // Convertimos el string a Date ajustado a UTC
              onChange={(date) => {
                handleDateChange(date, 'fh_FinEntregaEstimada');
              }}
              className={`mb-2 w-full rounded-lg py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
              language="es-MX"
              style={{ fontSize: '1.4rem', height: '4rem' }}
              theme={customDatePickerTheme}
              autoHide={false}
              key={filtros.fh_FinEntregaEstimada || 'fh_FinEntregaEstimada'} // Cambia la clave cuando el valor cambia
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
