import React, { useEffect, useMemo, useState } from 'react';
import { CustomMultiSelect } from '../components/custom/CustomMultiSelect';
import { Datepicker, Pagination, Tooltip } from 'flowbite-react';
import { customDatePickerTheme } from '../themes/customDatePickerTheme';
import { useForm } from '../hooks/useForm';
import {
  IFiltrosOrdenTrabajo,
  IOrdenesTrabajo,
} from '../interfaces/interfacesOrdenTrabajo';
import {
  getOrdenesTrabajo,
  getOrdenesTrabajoComboMultiSelect,
} from '../helpers/ordenTrabajo/apiOrdenTrabajo';
import { CustomSelectValue } from '../interfaces/interfacesGlobales';
import { IApiError } from '../interfaces/interfacesApi';
import Toast from '../components/Toast';
import { getEstatusComboMultiSelect } from '../helpers/apiEstatus';
import { buscarOrdenesTrabajoHelper } from '../helpers/ordenTrabajo/buscarOrdenesTrabajoHelper';
import { SearchIcon } from '../icons/SearchIcon';
import { useFormDate } from '../hooks/useFormDate';
import { WaitScreen } from '../components/WaitScreen';
import { ModalOrdenTrabajo } from '../dialogs/OrdenTrabajo/ModalOrdenTrabajo';
import { useDisclosure } from '@chakra-ui/react';
import { customPaginationTheme } from '../themes/customPaginationTheme';
import { ModalConfirmarIniciarOrdenTrabajo } from '../dialogs/OrdenTrabajo/ModalConfirmarIniciarOrdenTrabajo';

export const SeleccionarOrdenTrabajo = (): React.JSX.Element => {
  const [ordenesTrabajo, setOrdenesTrabajo] = useState<IOrdenesTrabajo[]>([]);
  const [ordenTrabajo, setOrdenTrabajo] = useState<IOrdenesTrabajo>();

  const obtenerFechasDelMes = () => {
    const fechaInicio = new Date();
    const fechaFin = new Date();

    // Establecer el primer día del mes
    fechaInicio.setDate(1);

    // Establecer el último día del mes
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    fechaFin.setDate(0); // El último día del mes actual

    // Convertir a formato YYYY-MM-DD
    const fh_InicioDefault = fechaInicio.toISOString().split('T')[0];
    const fh_FinDefault = fechaFin.toISOString().split('T')[0];

    return { fh_InicioDefault, fh_FinDefault };
  };

  // const { fh_InicioDefault, fh_FinDefault } = obtenerFechasDelMes();

  const { formState, setFormState, onInputChange, onResetForm } =
    useForm<IFiltrosOrdenTrabajo>({
      id_Pedido: '',
      id_Estatus: '',
      // fh_Inicio: fh_InicioDefault,
      // fh_Fin: fh_FinDefault,
      fh_Inicio: '',
      fh_Fin: '',
      pedidos: '',
      estatus: '',
    });

  const [ordenesTrabajoCombo, setOrdenesTrabajoCombo] = useState<
    CustomSelectValue[]
  >([]);
  const [estatusOrdenTrabajoCombo, setEstatusOrdenTrabajoCombo] = useState<
    CustomSelectValue[]
  >([]);
  const { handleDateChange, getDateForPicker } = useFormDate(
    formState,
    setFormState
  );
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const ITEMS_PER_PAGE = 4; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchOrdenesTrabajo = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const enviosData = await getOrdenesTrabajo(formState);
        setOrdenesTrabajo(enviosData.body);
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

    const fetchClientesCombo = async (): Promise<void> => {
      try {
        const arregloCombo = await getOrdenesTrabajoComboMultiSelect();
        setOrdenesTrabajoCombo(arregloCombo.body);
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

    const fetchEstatusOrdenTrabajoCombo = async (): Promise<void> => {
      try {
        const estatusData = await getEstatusComboMultiSelect({ id_Modulo: 6 }); // Modulo de Pedidos
        setEstatusOrdenTrabajoCombo(estatusData.body);
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

    fetchOrdenesTrabajo();
    fetchClientesCombo();
    fetchEstatusOrdenTrabajoCombo();
  }, []);

  useEffect(() => {
    closeModal();
  }, [ordenesTrabajo]);

  const buscarOrdenesTrabajo = async (
    filtros: IFiltrosOrdenTrabajo
  ): Promise<void> => {
    setIsLoading(true);

    const pedidos = Array.isArray(filtros.id_Pedido)
      ? filtros.id_Pedido
          .map((pedido: { value: unknown }) => pedido.value)
          .toString()
      : '';

    const estatus = Array.isArray(filtros.id_Estatus)
      ? filtros.id_Estatus
          .map((estatus: { value: unknown }) => estatus.value)
          .toString()
      : '';

    filtros.pedidos = pedidos;
    filtros.estatus = estatus;

    const ordenesTrabajoData = await buscarOrdenesTrabajoHelper(filtros);

    if (ordenesTrabajoData.success) {
      setOrdenesTrabajo(ordenesTrabajoData.body);
      setIsLoading(false);
    } else {
      setOrdenesTrabajo([]);
      setIsLoading(false);
      return;
    }
  };

  const handleMostrarOrdenTrabajo = (row: IOrdenesTrabajo): void => {
    openModal();
    setOrdenTrabajo({ ...row });
  };

  const TOTAL_ITEMS = ordenesTrabajo.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const ordenesTrabajoPaginadas = ordenesTrabajo.slice(startIndex, endIndex);

  return (
    <>
      {isLoading && <WaitScreen message="cargando..." />}
      <div className="mx-auto w-1/3 rounded-xl bg-[#068bff]">
        <h1 className="text-[3rem] text-center font-bold text-white">
          Orden de Trabajo
        </h1>
      </div>

      <div className="grid grid-cols-[25%_25%_20%_20%_10%] gap-[2rem] mx-auto mt-[4rem] w-[92%]">
        <div>
          <label className="text-[1.8rem] font-bold">Pedidos</label>
          <CustomMultiSelect
            options={ordenesTrabajoCombo}
            onChange={(newValue) => {
              setFormState((prevState) => ({
                ...prevState,
                id_Pedido: newValue as unknown as string,
              }));
            }}
          />
        </div>
        <div>
          <label className="text-[1.8rem] font-bold">Estatus</label>
          <CustomMultiSelect
            options={estatusOrdenTrabajoCombo}
            onChange={(newValue) => {
              setFormState((prevState) => ({
                ...prevState,
                id_Estatus: newValue as unknown as string,
              }));
            }}
          />
        </div>
        <div>
          <label className="text-[1.8rem] font-bold">Fecha Inicio</label>
          <Datepicker
            placeholder="Fecha Inicio"
            id="fh_Inicio"
            name="fh_Inicio"
            value={getDateForPicker(formState.fh_Inicio || '')} // Convertimos el string a Date ajustado a UTC
            onChange={(date) => {
              handleDateChange(date, 'fh_Inicio');
            }}
            className={`w-full rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
            language="es-MX"
            style={{ fontSize: '1.4rem', height: '4rem' }}
            theme={customDatePickerTheme}
            autoHide={false}
            key={formState.fh_Inicio || 'fh_Inicio'} // Cambia la clave cuando el valor cambia
          />
        </div>
        <div>
          <label className="text-[1.8rem] font-bold">Fecha Fin</label>
          <Datepicker
            placeholder="Fecha Fin"
            id="fh_Fin"
            name="fh_Fin"
            value={getDateForPicker(formState.fh_Fin || '')} // Convertimos el string a Date ajustado a UTC
            onChange={(date) => {
              handleDateChange(date, 'fh_Fin');
            }}
            className={`mb-2 w-full rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-[#656ed3e1] text-black`}
            language="es-MX"
            style={{ fontSize: '1.4rem', height: '4rem' }}
            theme={customDatePickerTheme}
            autoHide={false}
            key={formState.fh_Fin || 'fh_Fin'} // Cambia la clave cuando el valor cambia
          />
        </div>
        <div className="flex justify-start items-end mb-[.2rem] cursor-pointer">
          <Tooltip
            content="Buscar"
            className="text-[1.3rem]"
            placement="bottom"
          >
            <SearchIcon
              className="text-[#1769d8] text-[1.8rem]"
              onClick={() => buscarOrdenesTrabajo(formState)}
            />
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-[14rem] gap-y-[4rem] mt-[4rem] mb-[10rem] place-items-center w-[120rem] mx-auto">
        {ordenesTrabajoPaginadas.map((ordenTrabajo) => (
          <div
            key={ordenTrabajo.id_OrdenTrabajo}
            // className={`border-[.3rem] rounded-[3rem] bg-white shadowOrdenTrabajo w-[60rem]`}
            className={`rounded-[3rem] bg-white shadowOrdenTrabajo w-[54rem]`}
            // style={{ borderColor: ordenTrabajo.color_Estatus }}
          >
            <p
              className={`text-[2.4rem] w-1/2 rounded-tl-[2rem] rounded-br-[2rem] text-white pl-[2rem] py-[1rem]`}
              style={{ backgroundColor: ordenTrabajo.color_Estatus }}
            >
              Orden de trabajo #{ordenTrabajo.id_OrdenTrabajo}
            </p>
            <p className="text-[1.6rem] font-bold mt-[2rem] ml-[1rem]">
              Numero de pedido:{' '}
              <span className="font-normal">#{ordenTrabajo.id_Pedido}</span>
            </p>
            <p className="text-[1.6rem] font-bold mt-[1rem] ml-[1rem]">
              Fecha Recibido:{' '}
              <span className="font-normal">{ordenTrabajo.fh_Registro}</span>
            </p>
            <p className="text-[1.6rem] font-bold mt-[1rem] ml-[1rem]">
              Fecha Finalizacion:{' '}
              <span className="font-normal">
                {ordenTrabajo.fh_Finalizacion
                  ? ordenTrabajo.fh_Finalizacion
                  : 'Sin finalizar'}
              </span>
            </p>
            <p className="text-[1.6rem] font-bold mt-[1rem] ml-[1rem]">
              Modelo:{' '}
              <span className="font-normal">{ordenTrabajo.de_Modelo}</span>
            </p>
            <p className="text-[1.6rem] font-bold mt-[1rem] ml-[1rem]">
              Color:{' '}
              <span className="font-normal">{ordenTrabajo.de_ColorTela}</span>
            </p>
            <p className="text-[1.6rem] font-bold mt-[1rem] ml-[1rem]">
              Cantidad:{' '}
              <span className="font-normal">{ordenTrabajo.nu_Cantidad}</span>
            </p>
            <p className="text-[1.6rem] font-bold mt-[1rem] ml-[1rem]">
              Cantidad Pendiente:{' '}
              <span className="font-normal">
                {ordenTrabajo.nu_CantidadPendiente
                  ? ordenTrabajo.nu_CantidadPendiente
                  : 0}
              </span>
            </p>
            <p className="text-[1.6rem] font-bold mt-[1rem] ml-[1rem]">
              Cliente:{' '}
              <span className="font-normal">{ordenTrabajo.nb_Cliente}</span>
            </p>

            <div className="text-right mt-[2rem]">
              <button
                className={`text-[1.9rem] text-white p-[1.2rem] px-[3rem] rounded-tl-[3rem] rounded-br-[2.5rem] w-2/5`}
                style={{ backgroundColor: ordenTrabajo.color_Estatus }}
                onClick={() => handleMostrarOrdenTrabajo(ordenTrabajo)}
              >
                {ordenTrabajo.de_Estatus}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex overflow-x-auto sm:justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE)}
          onPageChange={onPageChange}
          showIcons
          theme={customPaginationTheme}
          className="mb-[4rem]"
        />
      </div>

      <ModalOrdenTrabajo
        isOpen={isModalOpen}
        onClose={closeModal}
        actualizarOrdenesTrabajo={setOrdenesTrabajo}
        row={
          ordenTrabajo
            ? ordenTrabajo
            : {
                id_OrdenTrabajo: 0,
                id_Pedido: 0,
                id_Estatus: 0,
                pedidos: '',
                estatus: '',
                id_Cliente: 0,
                fh_Pedido: '',
                fh_Registro: '',
                fh_Finalizacion: '',
                nu_Cantidad: 0,
                nu_CantidadPendiente: 0,
                nb_Cliente: '',
                de_Modelo: '',
                de_Genero: '',
                de_ColorTela: '',
                de_Estatus: '',
                color_Estatus: '',
                de_Talla: '',
                de_ComentarioCancelacion: '',
              }
        }
        sn_Editar={false}
        sn_Visualizar={false}
      />
    </>
  );
};
