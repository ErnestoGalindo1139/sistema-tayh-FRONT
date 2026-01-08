import React, { useState, useEffect, useRef } from 'react';
import { IApiError } from '../interfaces/interfacesApi';
import Toast from '../components/Toast';
import {
  getEspecificacionesOrdenTrabajo,
  getTemasColorTela,
} from '../helpers/ordenTrabajo/apiOrdenTrabajo';
import { IEspecificacionesOrdenTrabajo } from '../interfaces/interfacesOrdenTrabajo';
import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from 'flowbite-react';
import { customPaginationOrdenTrabajoTheme } from '../themes/customPaginationOrdenTrabajoTheme';
import { useDisclosure } from '@chakra-ui/react';
import { ModalFinalizarOrdenTrabajo } from '../dialogs/OrdenTrabajo/ModalFinalizarOrdenTrabajo';
import { ModalCancelarOrdenTrabajo } from '../dialogs/OrdenTrabajo/ModalCancelarOrdenTrabajo';

/* =======================
   Tema por color de tela
======================= */
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

export const OrdenTrabajo = (): React.JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const intervalRef = useRef<number | null>(null);

  /* =======================
     DATA
  ======================= */
  const [paginas, setPaginas] = useState<IEspecificacionesOrdenTrabajo[][]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [key, setKey] = useState(0);

  const [temasPorColorTela, setTemasPorColorTela] = useState<
    Record<string, TemaColorTela>
  >({});

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

  /* =======================
     FETCH DATOS
  ======================= */
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const res = await getEspecificacionesOrdenTrabajo({
          id_OrdenTrabajo: id,
        });

        const map = new Map<string, IEspecificacionesOrdenTrabajo[]>();

        res.body.forEach((item) => {
          const key = `${item.id_Prenda}-${item.id_ModeloPerspectiva}`;

          if (!map.has(key)) {
            map.set(key, []);
          }

          map.get(key)!.push(item);
        });

        const paginasConstruidas = Array.from(map.values());

        paginasConstruidas.forEach((p) =>
          p.sort((a, b) => a.nu_Especificacion - b.nu_Especificacion)
        );

        setPaginas(paginasConstruidas);
        setTotalPaginas(paginasConstruidas.length);
        setPaginaActual(1);
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: 'Ocurrió un Error',
          text: (error as IApiError).message || 'Error desconocido',
        });
      }
    };

    fetchData();
  }, [id]);

  /* =======================
     TEMAS
  ======================= */
  useEffect(() => {
    const fetchTemas = async (): Promise<void> => {
      const res = await getTemasColorTela();

      const map = res.body.reduce(
        (acc: Record<string, TemaColorTela>, item) => {
          acc[item.de_ColorTela.trim().toUpperCase()] = {
            primario: item.primario,
            primarioSuave: item.primarioSuave,
            fondoSuave: item.fondoSuave,
            textoClaro: item.textoClaro,
            textoOscuro: item.textoOscuro,
            chipFondo: item.chipFondo,
            chipTexto: item.chipTexto,
            titulo: item.titulo,
          };
          return acc;
        },
        {}
      );

      setTemasPorColorTela(map);
    };

    fetchTemas();
  }, []);

  /* =======================
     PÁGINA ACTUAL
  ======================= */
  const especificacionesPedidosPerspectivas =
    paginas[paginaActual - 1] || [];

  const rowSeguro =
    especificacionesPedidosPerspectivas.length > 0
      ? especificacionesPedidosPerspectivas[0]
      : null;

  const colorTela =
    rowSeguro?.de_ColorTela?.trim().toUpperCase() || '';

  const tema = temasPorColorTela[colorTela] || temasPorColorTela.DEFAULT;

  const onPageChange = (page: number): void => {
    setPaginaActual(page);
    setKey((prev) => prev + 1);
  };

  /* =======================
     RENDER (DISEÑO INTACTO)
  ======================= */
  return (
    <>
      <div
        key={key}
        className="flex flex-col min-h-screen pt-[2rem]"
        style={{ backgroundColor: tema?.primarioSuave }}
      >
        {/* 🔵 TÍTULO */}
        <div className="text-center mb-8">
          <h1
            className="text-[4rem] font-bold"
            style={{ color: tema?.titulo }}
          >
            {rowSeguro?.de_Modelo?.toUpperCase()} -{' '}
            {rowSeguro?.de_ColorTela?.toUpperCase()}
          </h1>
        </div>

        <div className="flex-grow">
          <div className="grid grid-cols-[1fr_2fr_1fr]">
            {/* PANEL IZQUIERDO */}
            <div className="pl-[3rem]">
              <div
                className="p-[1.5rem] rounded-2xl"
                style={{ backgroundColor: tema?.primario }}
              >
                <h2
                  className="text-[3rem] font-bold"
                  style={{ color: tema?.textoClaro }}
                >
                  Orden de Trabajo - #{rowSeguro?.id_OrdenTrabajo}
                </h2>

                <p className="text-[2.5rem]" style={{ color: tema?.textoClaro }}>
                  Color de tela: {rowSeguro?.de_ColorTela}
                </p>
                <p className="text-[2.5rem]" style={{ color: tema?.textoClaro }}>
                  Cantidad Total: {rowSeguro?.nu_Cantidad}
                </p>
                <p className="text-[2.5rem]" style={{ color: tema?.textoClaro }}>
                  Cantidad Pendiente: {rowSeguro?.nu_CantidadPendiente}
                </p>
                <p className="text-[2.5rem]" style={{ color: tema?.textoClaro }}>
                  Modelo: {rowSeguro?.de_Modelo}
                </p>
                <p className="text-[2.5rem]" style={{ color: tema?.textoClaro }}>
                  Tipo de tela: {rowSeguro?.de_TipoTela}
                </p>
                <p className="text-[2.5rem]" style={{ color: tema?.textoClaro }}>
                  Talla: {rowSeguro?.de_Talla}
                </p>
              </div>
            </div>

            {/* IMAGEN */}
            <div className="m-auto pt-[.4rem]">
              <img
                src={rowSeguro?.de_Ruta}
                className="w-3/4 h-auto m-auto rounded-[18rem]"
                style={{ backgroundColor: tema?.primarioSuave }}
              />
            </div>

            {/* ESPECIFICACIONES */}
            <div className="pr-[2.4rem]">
              <h2
                className="text-[3rem] font-semibold text-center rounded-t-2xl"
                style={{
                  backgroundColor: tema?.primario,
                  color: tema?.textoClaro,
                }}
              >
                Especificaciones
              </h2>

              <div
                className="space-y-4 p-4 rounded-b-2xl"
                style={{ backgroundColor: tema?.fondoSuave }}
              >
                {especificacionesPedidosPerspectivas.map((e) => (
                  <div key={e.id_Especificacion} className="text-4xl">
                    <span
                      className="font-bold"
                      style={{ color: tema?.chipTexto }}
                    >
                      {e.nu_Especificacion}.{' '}
                    </span>
                    <span style={{ color: tema?.textoOscuro }}>
                      {e.de_Especificacion}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="flex items-center">
          <img
            src="img/Logo-Tayh_Horizontal-Negro.png"
            className="w-96 pl-8"
          />

          <Pagination
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={onPageChange}
            showIcons
            theme={customPaginationOrdenTrabajoTheme}
          />

          <div className="w-full text-end mr-[4rem]">
            <button
              className="text-[2.2rem] p-[1rem] text-white font-bold rounded-2xl mr-[3rem]"
              style={{ backgroundColor: '#1a9a1a' }}
              onClick={openModal}
            >
              Finalizar Orden de Trabajo
            </button>

            <button
              className="text-[2.2rem] p-[1rem] text-white font-bold rounded-2xl mr-[3rem]"
              style={{ backgroundColor: '#ff1a1a' }}
              onClick={openModalCancelar}
            >
              Cancelar
            </button>

            <button
              className="text-[2.2rem] p-[1rem] text-white font-bold rounded-2xl"
              style={{ backgroundColor: '#ff6b16' }}
              onClick={() => navigate(-1)}
            >
              Regresar
            </button>
          </div>
        </footer>
      </div>

      {rowSeguro && (
        <ModalFinalizarOrdenTrabajo
          isOpen={isModalOpen}
          onClose={closeModal}
          finalizarOrdenTrabajo={() => {}}
          row={rowSeguro}
        />
      )}

      {rowSeguro && (
        <ModalCancelarOrdenTrabajo
          isOpen={isModalCancelarOpen}
          onClose={closeModalCancelar}
          sn_PantallaOrdenTrabajo
          row={rowSeguro}
        />
      )}
    </>
  );
};
