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

  const [autoPlayDelay, setAutoPlayDelay] = useState(15000); // 15s por defecto
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const resetAutoChange = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoPlayPaused || totalPaginas <= 1) return;

    intervalRef.current = window.setInterval(() => {
      setPaginaActual((prev) => {
        const nextPage = prev < totalPaginas ? prev + 1 : 1;
        onPageChange(nextPage);
        return nextPage;
      });
    }, autoPlayDelay);
  };

  useEffect(() => {
    resetAutoChange();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [totalPaginas, paginas, autoPlayDelay, autoPlayPaused]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let interval: any;
    let timeout: any;
    let isHovering = false; // 👈 Detecta hover

    // 🛑 Eventos hover
    const onMouseEnter = () => {
      isHovering = true;
    };

    const onMouseLeave = () => {
      isHovering = false;
    };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    const startScroll = () => {
      interval = setInterval(() => {
        // 🛑 Si está hover, no hacer scroll
        if (isHovering) return;

        // 📌 Si llega al final
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          clearInterval(interval);

          // ⏳ Esperar 2 segundos al final
          timeout = setTimeout(() => {
            // 🔁 Volver arriba
            el.scrollTop = 0;

            // ⏳ Esperar 2 segundos antes de volver a bajar
            timeout = setTimeout(() => {
              startScroll();
            }, 2000);
          }, 2000);
        } else {
          el.scrollTop += 1; // velocidad
        }
      }, 30);
    };

    // ⏳ Espera inicial
    timeout = setTimeout(() => {
      startScroll();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);

      // 🧹 Limpiar listeners
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [paginaActual]);

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
  const especificacionesPedidosPerspectivas = paginas[paginaActual - 1] || [];

  const rowSeguro =
    especificacionesPedidosPerspectivas.length > 0
      ? especificacionesPedidosPerspectivas[0]
      : null;

  const colorTela = rowSeguro?.de_ColorTela?.trim().toUpperCase() || '';

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
          <h1 className="text-[4rem] font-bold" style={{ color: tema?.titulo }}>
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

                <p
                  className="text-[2.5rem]"
                  style={{ color: tema?.textoClaro }}
                >
                  Color de tela: {rowSeguro?.de_ColorTela}
                </p>
                <p
                  className="text-[2.5rem]"
                  style={{ color: tema?.textoClaro }}
                >
                  Cantidad Total: {rowSeguro?.nu_Cantidad}
                </p>
                <p
                  className="text-[2.5rem]"
                  style={{ color: tema?.textoClaro }}
                >
                  Cantidad Pendiente: {rowSeguro?.nu_CantidadPendiente}
                </p>
                <p
                  className="text-[2.5rem]"
                  style={{ color: tema?.textoClaro }}
                >
                  Modelo: {rowSeguro?.de_Modelo}
                </p>
                <p
                  className="text-[2.5rem]"
                  style={{ color: tema?.textoClaro }}
                >
                  Tipo de tela: {rowSeguro?.de_TipoTela}
                </p>
                <p
                  className="text-[2.5rem]"
                  style={{ color: tema?.textoClaro }}
                >
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
                ref={scrollRef}
                className="space-y-4 p-4 rounded-b-2xl 
               overflow-y-auto max-h-[600px] scrollbar-colorful"
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
        {/* <footer className="flex items-center">
          <img src="img/Logo-Tayh_Horizontal-Negro.png" className="w-96 pl-8" />

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
        </footer> */}

        {/* 🔵 FOOTER */}
        <footer className="flex flex-col sm:flex-row justify-start items-center border-gray-400 animate-flip-up animate-ease-out">
          <img
            src="img/Logo-Tayh_Horizontal-Negro.png"
            alt="Logo Empresa"
            className="w-60 sm:w-96 h-auto object-contain mb-4 sm:mb-0 pl-8 pr-8"
          />

          <Pagination
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={onPageChange}
            showIcons
            theme={customPaginationOrdenTrabajoTheme}
            className="ml-[2rem]"
          />

          {/* ⏱ CONTROLES AUTOPLAY */}
          <div className="flex items-center gap-4 ml-[2rem]">
            <button
              className="text-[1.8rem] px-[1.2rem] py-[.6rem] font-bold rounded-xl text-white"
              style={{
                backgroundColor: autoPlayPaused ? '#16a34a' : '#6b7280',
              }}
              onClick={() => setAutoPlayPaused((prev) => !prev)}
            >
              {autoPlayPaused ? '▶ Reanudar' : '⏸ Pausar'}
            </button>

            <select
              value={autoPlayDelay}
              onChange={(e) => setAutoPlayDelay(Number(e.target.value))}
              className="text-[1.6rem] p-2 rounded-xl border"
            >
              <option value={5000}>5 s</option>
              <option value={10000}>10 s</option>
              <option value={15000}>15 s</option>
              <option value={30000}>30 s</option>
            </select>
          </div>

          <div className="w-[100%] text-end mr-[4rem]">
            <button
              className="text-[2.2rem] p-[1rem] text-white font-bold rounded-2xl shadowBotonRegresarOrdenTrabajo mr-[3rem]"
              style={{ backgroundColor: '#1a9a1a' }}
              onClick={openModal}
            >
              Finalizar Orden de Trabajo
            </button>

            <button
              className="text-[2.2rem] p-[1rem] text-white font-bold rounded-2xl shadowBotonRegresarOrdenTrabajo mr-[3rem]"
              style={{ backgroundColor: '#ff1a1a' }}
              onClick={openModalCancelar}
            >
              Cancelar
            </button>

            <button
              className="text-[2.2rem] p-[1rem] text-white font-bold rounded-2xl shadowBotonRegresarOrdenTrabajo"
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
