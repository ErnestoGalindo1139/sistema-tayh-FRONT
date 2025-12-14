import React, { useState, useEffect, useRef } from 'react';
import { IApiError } from '../interfaces/interfacesApi';
import Toast from '../components/Toast';
import { getEspecificacionesOrdenTrabajo } from '../helpers/ordenTrabajo/apiOrdenTrabajo';
import { IEspecificacionesOrdenTrabajo } from '../interfaces/interfacesOrdenTrabajo';
import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from 'flowbite-react';
import { customPaginationOrdenTrabajoTheme } from '../themes/customPaginationOrdenTrabajoTheme';
import { useDisclosure } from '@chakra-ui/react';
import { ModalFinalizarOrdenTrabajo } from '../dialogs/OrdenTrabajo/ModalFinalizarOrdenTrabajo';
import { ModalCancelarOrdenTrabajo } from '../dialogs/OrdenTrabajo/ModalCancelarOrdenTrabajo';

// 🎨 Tema por color de tela
type TemaColorTela = {
  primario: string;
  primarioSuave: string;
  fondoSuave: string;
  textoClaro: string;
  textoOscuro: string;
  chipFondo: string;
  chipTexto: string;
  titulo: string;
};

const temasPorColorTela: Record<string, TemaColorTela> = {
  BLANCO: {
    primario: '#e5e7eb',
    primarioSuave: '#f5f5f5',
    fondoSuave: '#ffffff',
    textoClaro: '#111827',
    textoOscuro: '#111827',
    chipFondo: '#f3f4f6',
    chipTexto: '#111827',
    titulo: '#111827',
  },
  'AZUL ACERO': {
    primario: '#4a6274',
    primarioSuave: '#d8e0e6',
    fondoSuave: '#eef2f6',
    textoClaro: '#ffffff',
    textoOscuro: '#1f2933',
    chipFondo: '#e0e7ef',
    chipTexto: '#243b53',
    titulo: '#4a6274',
  },
  'AZUL MARINO': {
    primario: '#1E3A8A',
    primarioSuave: '#E3ECFF',
    fondoSuave: '#F1F5FF',
    textoClaro: '#ffffff',
    textoOscuro: '#111827',
    chipFondo: '#DBEAFE',
    chipTexto: '#1E40AF',
    titulo: '#1E3A8A',
  },
  NEGRO: {
    primario: '#000000',
    primarioSuave: '#27272a',
    fondoSuave: '#18181b',
    textoClaro: '#f9fafb',
    textoOscuro: '#f9fafb',
    chipFondo: '#27272a',
    chipTexto: '#f9fafb',
    titulo: '#f9fafb',
  },
  UVA: {
    primario: '#5e2a6a',
    primarioSuave: '#e8d6ef',
    fondoSuave: '#f4e9f8',
    textoClaro: '#ffffff',
    textoOscuro: '#3b2a3e',
    chipFondo: '#f1d9ff',
    chipTexto: '#4b214f',
    titulo: '#5e2a6a',
  },
  DEFAULT: {
    primario: '#1E3A8A',
    primarioSuave: '#E3ECFF',
    fondoSuave: '#F3F4FF',
    textoClaro: '#ffffff',
    textoOscuro: '#111827',
    chipFondo: '#DBEAFE',
    chipTexto: '#1E40AF',
    titulo: '#1E3A8A',
  },
};

export const OrdenTrabajo = (): React.JSX.Element => {
  const [especificacionesPedidos, setEspecificacionesPedidos] = useState<
    IEspecificacionesOrdenTrabajo[]
  >([]);
  const [
    especificacionesPedidosPerspectivas,
    setEspecificacionesPedidosPerspectivas,
  ] = useState<IEspecificacionesOrdenTrabajo[]>([]);
  const [perspectivaActual, setPerspectivaActual] = useState(1);
  const [totalPerspectivas, setTotalPerspectivas] = useState(0);
  const [finOrdenTrabajo, setFinOrdenTrabajo] = useState(0);
  const [key, setKey] = useState(0);

  const intervalRef = useRef<number | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const {
    isOpen: isModalCancelarOpen,
    onOpen: openModalCancelar,
    onClose: closeModalCancelar,
  } = useDisclosure();

  // 🔹 Tema dinámico según el color de tela
  const colorTela =
    especificacionesPedidosPerspectivas[0]?.de_ColorTela
      ?.trim()
      ?.toUpperCase() || '';
  const tema = temasPorColorTela[colorTela] || temasPorColorTela.DEFAULT;

  const resetAutoChange = (): void => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setPerspectivaActual((prev) => {
        const nextPage = prev < totalPerspectivas ? prev + 1 : 1;
        onPageChange(nextPage);
        return nextPage;
      });
    }, 10000);
  };

  useEffect(() => {
    const fetchEspecificacionesPedidos = async (): Promise<void> => {
      try {
        const especificacionesPedidosData =
          await getEspecificacionesOrdenTrabajo({
            id_OrdenTrabajo: id,
          });

        setEspecificacionesPedidos(especificacionesPedidosData.body);

        if (especificacionesPedidosData.body?.length > 0) {
          setTotalPerspectivas(
            especificacionesPedidosData.body[0].totalModeloPerspectiva
          );

          const pedidosFiltrados = especificacionesPedidosData.body.filter(
            (item) => item.id_ModeloPerspectiva === perspectivaActual
          );

          setEspecificacionesPedidosPerspectivas(pedidosFiltrados);
        }
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: (error as IApiError).message || 'Ocurrió un error desconocido',
        });
      }
    };

    fetchEspecificacionesPedidos();
  }, []);

  useEffect(() => {
    resetAutoChange();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalPerspectivas, especificacionesPedidos]);

  const onPageChange = (page: number): void => {
    const pedidosFiltrados = especificacionesPedidos.filter(
      (item) => item.id_ModeloPerspectiva === page
    );

    setEspecificacionesPedidosPerspectivas(pedidosFiltrados);
    setPerspectivaActual(page);

    setKey((prev) => prev + 1);

    resetAutoChange();
  };

  const handleRegresar = (): void => navigate(-1);
  const handleFinalizarOrdenTrabajo = (): void => openModal();
  const abrirModalCancelarOrdenTrabajo = (): void => openModalCancelar();

  return (
    <>
      <div
        key={key}
        className="flex flex-col min-h-screen pt-[2rem]"
        style={{ backgroundColor: tema.primarioSuave }}
      >
        {/* 🔵 TÍTULO PRINCIPAL */}
        <div className="text-center mb-8 animate-fade-down animate-duration-700">
          <h1
            className="text-[4rem] font-bold tracking-wide"
            style={{ color: tema.titulo }}
          >
            {especificacionesPedidosPerspectivas[0]?.de_Modelo?.toUpperCase()} -{' '}
            {especificacionesPedidosPerspectivas[0]?.de_ColorTela?.toUpperCase()}
          </h1>
        </div>

        <div className="flex-grow">
          <div className="grid grid-cols-[1fr_2fr_1fr]">
            {/* 🔵 PANEL IZQUIERDO */}
            <div className="pl-[3rem]">
              <div
                className="p-[1.5rem] animate-fade-right animate-duration-1000 animate-ease-in rounded-2xl"
                style={{ backgroundColor: tema.primario }}
              >
                <h2
                  className="text-[3rem] font-bold"
                  style={{ color: tema.textoClaro }}
                >
                  Orden de Trabajo - #
                  {especificacionesPedidosPerspectivas[0]?.id_OrdenTrabajo}
                </h2>

                <div>
                  <p
                    className="text-[2.5rem]"
                    style={{ color: tema.textoClaro }}
                  >
                    Color de tela:{' '}
                    {especificacionesPedidosPerspectivas[0]?.de_ColorTela}
                  </p>

                  <p
                    className="text-[2.5rem]"
                    style={{ color: tema.textoClaro }}
                  >
                    Cantidad Total:{' '}
                    {especificacionesPedidosPerspectivas[0]?.nu_Cantidad}
                  </p>

                  <p
                    className="text-[2.5rem]"
                    style={{ color: tema.textoClaro }}
                  >
                    Cantidad Pendiente:{' '}
                    {
                      especificacionesPedidosPerspectivas[0]
                        ?.nu_CantidadPendiente
                    }
                  </p>

                  <p
                    className="text-[2.5rem]"
                    style={{ color: tema.textoClaro }}
                  >
                    Modelo: {especificacionesPedidosPerspectivas[0]?.de_Modelo}
                  </p>

                  <p
                    className="text-[2.5rem]"
                    style={{ color: tema.textoClaro }}
                  >
                    Tipo de tela:{' '}
                    {especificacionesPedidosPerspectivas[0]?.de_TipoTela}
                  </p>

                  <p
                    className="text-[2.5rem]"
                    style={{ color: tema.textoClaro }}
                  >
                    Talla: {especificacionesPedidosPerspectivas[0]?.de_Talla}
                  </p>
                </div>
              </div>
            </div>

            {/* 🔵 IMAGEN CENTRAL */}
            <div className="m-auto pt-[.4rem] animate-fade-down animate-ease-in">
              <img
                src={`${especificacionesPedidosPerspectivas[0]?.de_Ruta}`}
                alt="Imagen Editada"
                className="w-3/4 h-auto m-auto rounded-[18rem]"
                style={{ backgroundColor: tema.primarioSuave }}
              />
            </div>

            {/* 🔵 PANEL DERECHO */}
            <div className="pr-[2.4rem] animate-fade-left animate-duration-1000 animate-ease-in">
              <div>
                <h2
                  className="text-[3rem] font-semibold text-center rounded-t-2xl"
                  style={{
                    backgroundColor: tema.primario,
                    color: tema.textoClaro,
                  }}
                >
                  Especificaciones
                </h2>

                <div
                  className="space-y-4 p-4 rounded-b-2xl"
                  style={{ backgroundColor: tema.fondoSuave }}
                >
                  {especificacionesPedidosPerspectivas.length > 0 &&
                    especificacionesPedidosPerspectivas.map(
                      (especificacion) => (
                        <ul
                          key={especificacion.id_Especificacion}
                          className="flex items-center p-2"
                        >
                          <li
                            className="font-bold mr-4 text-4xl"
                            style={{ color: tema.chipTexto }}
                          >
                            {especificacion.nu_Especificacion}.{' '}
                            <span
                              className="font-normal text-[2.4rem]"
                              style={{ color: tema.textoOscuro }}
                            >
                              {especificacion.de_Especificacion}
                            </span>
                          </li>
                        </ul>
                      )
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔵 FOOTER */}
        <footer className="flex flex-col sm:flex-row justify-start items-center border-gray-400 animate-flip-up animate-ease-out">
          <img
            src="img/Logo-Tayh_Horizontal-Negro.png"
            alt="Logo Empresa"
            className="w-60 sm:w-96 h-auto object-contain mb-4 sm:mb-0 pl-8 pr-8"
          />

          <Pagination
            currentPage={perspectivaActual}
            totalPages={totalPerspectivas}
            onPageChange={onPageChange}
            showIcons
            theme={customPaginationOrdenTrabajoTheme}
            className="ml-[2rem]"
          />

          <div className="w-[100%] text-end mr-[4rem]">
            <button
              className="text-[2.2rem] p-[1rem] text-white font-bold rounded-2xl shadowBotonRegresarOrdenTrabajo mr-[3rem]"
              style={{ backgroundColor: '#1a9a1a' }}
              onClick={handleFinalizarOrdenTrabajo}
            >
              Finalizar Orden de Trabajo
            </button>

            <button
              className="text-[2.2rem] p-[1rem] text-white font-bold rounded-2xl shadowBotonRegresarOrdenTrabajo mr-[3rem]"
              style={{ backgroundColor: '#ff1a1a' }}
              onClick={abrirModalCancelarOrdenTrabajo}
            >
              Cancelar
            </button>

            <button
              className="text-[2.2rem] p-[1rem] text-white font-bold rounded-2xl shadowBotonRegresarOrdenTrabajo"
              style={{ backgroundColor: '#ff6b16' }}
              onClick={handleRegresar}
            >
              Regresar
            </button>
          </div>
        </footer>
      </div>

      {/* 🔵 MODALES */}
      <ModalFinalizarOrdenTrabajo
        isOpen={isModalOpen}
        onClose={closeModal}
        finalizarOrdenTrabajo={setFinOrdenTrabajo}
        row={
          especificacionesPedidosPerspectivas[0] ?? {
            id_OrdenTrabajo: 0,
            de_ColorTela: '',
            nu_Cantidad: 0,
            nu_CantidadPendiente: 0,
            de_Modelo: '',
            de_TipoTela: '',
            de_Talla: '',
            de_Ruta: '',
            id_ModeloPerspectiva: 0,
            totalModeloPerspectiva: 0,
            id_Especificacion: 0,
            nu_Especificacion: 0,
            de_Especificacion: '',
            de_Genero: '',
            id_ModeloImagen: 0,
            sn_ActivoImagen: 0,
            id_Pedido: 0,
          }
        }
      />

      <ModalCancelarOrdenTrabajo
        isOpen={isModalCancelarOpen}
        onClose={closeModalCancelar}
        sn_PantallaOrdenTrabajo={true}
        row={
          especificacionesPedidosPerspectivas[0] ?? {
            id_OrdenTrabajo: 0,
            de_ColorTela: '',
            nu_Cantidad: 0,
            nu_CantidadPendiente: 0,
            de_Modelo: '',
            de_TipoTela: '',
            de_Talla: '',
            de_Ruta: '',
            id_ModeloPerspectiva: 0,
            totalModeloPerspectiva: 0,
            id_Especificacion: 0,
            nu_Especificacion: 0,
            de_Especificacion: '',
            de_Genero: '',
            id_ModeloImagen: 0,
            sn_ActivoImagen: 0,
            id_Pedido: 0,
          }
        }
      />
    </>
  );
};
