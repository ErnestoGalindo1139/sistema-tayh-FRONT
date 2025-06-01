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

  const { id } = useParams();

  // Referencia para controlar el intervalo
  const intervalRef = useRef<number | null>(null);

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

  // Función para restablecer el cambio automático
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

        if (
          especificacionesPedidosData.body &&
          especificacionesPedidosData.body.length > 0
        ) {
          setTotalPerspectivas(
            especificacionesPedidosData.body[0].totalModeloPerspectiva
          );
          const pedidosFiltrados = especificacionesPedidosData.body.filter(
            (item) => {
              return item.id_ModeloPerspectiva === perspectivaActual;
            }
          );
          setEspecificacionesPedidosPerspectivas(pedidosFiltrados);
        }
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

    fetchEspecificacionesPedidos();
  }, []);

  useEffect(() => {
    resetAutoChange(); // Inicia el intervalo al montar el componente
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalPerspectivas, especificacionesPedidos]);

  // Actualiza la perspectiva y fuerza el reinicio de la animación
  const onPageChange = (page: number): void => {
    const pedidosFiltrados = especificacionesPedidos.filter(
      (item) => item.id_ModeloPerspectiva === page
    );

    setEspecificacionesPedidosPerspectivas(pedidosFiltrados);
    setPerspectivaActual(page);

    // Forzar el reinicio de las animaciones
    setKey((prev) => prev + 1);

    resetAutoChange();
  };

  const handleRegresar = (): void => {
    navigate(-1);
  };

  const handleFinalizarOrdenTrabajo = (): void => {
    openModal();
  };

  const abrirModalCancelarOrdenTrabajo = (): void => {
    openModalCancelar();
  };

  return (
    <>
      <div
        key={key}
        className="flex flex-col min-h-screen bg-[#F8F9FA] pt-[2rem]"
      >
        {/* Texto de especificaciones */}
        <div className="flex-grow">
          {/* Contenedor de imagen y especificaciones */}
          <div className="grid grid-cols-[1fr_2fr_1fr]">
            <div className="pl-[3rem]">
              <div className="bg-[#1E40AF] p-[1.5rem] animate-fade-right animate-duration-1000 animate-ease-in rounded-2xl">
                <h2 className="text-[3rem] font-bold text-white">
                  Orden de Trabajo - #
                  {especificacionesPedidosPerspectivas[0]?.id_OrdenTrabajo}
                </h2>
                <div>
                  <p className="text-[2.5rem] text-white">
                    Color de tela:{' '}
                    {especificacionesPedidosPerspectivas[0]?.de_ColorTela}
                  </p>
                  <p className="text-[2.5rem] text-white">
                    Cantidad Total:{' '}
                    {especificacionesPedidosPerspectivas[0]?.nu_Cantidad}
                  </p>
                  <p className="text-[2.5rem] text-white">
                    Cantidad Pendiente:{' '}
                    {
                      especificacionesPedidosPerspectivas[0]
                        ?.nu_CantidadPendiente
                    }
                  </p>
                  <p className="text-[2.5rem] text-white">
                    Modelo: {especificacionesPedidosPerspectivas[0]?.de_Modelo}
                  </p>
                  <p className="text-[2.5rem] text-white">
                    Tipo de tela:{' '}
                    {especificacionesPedidosPerspectivas[0]?.de_TipoTela}
                  </p>
                  <p className="text-[2.5rem] text-white">
                    Talla: {especificacionesPedidosPerspectivas[0]?.de_Talla}
                  </p>
                </div>
              </div>
            </div>

            {/* Imagen editada a la izquierda */}
            <div className="m-auto pt-[.4rem] animate-fade-down animate-ease-in">
              <img
                src={`${especificacionesPedidosPerspectivas[0]?.de_Ruta}`}
                alt="Imagen Editada"
                className="w-3/4 h-auto m-auto bg-[#E3ECFF] rounded-[18rem]"
              />
            </div>

            {/* Lista de especificaciones a la derecha */}
            <div className="pr-[2.4rem] animate-fade-left animate-duration-1000 animate-ease-in">
              <div>
                <h2 className="text-[3rem] font-semibold text-center bg-[#1E3A8A] rounded-t-2xl text-white">
                  Especificaciones
                </h2>

                <div className="space-y-4 bg-[#E3ECFF] rounded-b-2xl">
                  {/* {modelos && modelos.length > 0 ? ( */}

                  {especificacionesPedidosPerspectivas &&
                  especificacionesPedidosPerspectivas.length > 0 ? (
                    especificacionesPedidosPerspectivas.map(
                      (especificacion) => (
                        <ul
                          key={especificacion.id_Especificacion}
                          className="flex items-center justify-between p-4"
                        >
                          <li className="font-bold mr-4 text-4xl text-[#2563EB]">
                            {especificacion.nu_Especificacion}.{' '}
                            <span className="font-normal text-[2.4rem] text-[#111827]">
                              {especificacion.de_Especificacion}
                            </span>
                          </li>
                        </ul>
                      )
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex flex-col sm:flex-row justify-start items-center border-gray-400 animate-flip-up animate-ease-out">
          {/* Logo de la empresa */}
          <img
            src="img/Logo-Tayh_Horizontal-Negro.png" // Reemplaza con la ruta correcta del logo
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
              className="text-[2.2rem] bg-[#1a9a1a] hover:bg-[#2eb92e] p-[1rem] text-white font-bold rounded-2xl shadowBotonRegresarOrdenTrabajo mr-[3rem]"
              onClick={handleFinalizarOrdenTrabajo}
            >
              Finalizar Orden de Trabajo
            </button>
            <button
              className="text-[2.2rem] bg-[#ff1a1a] hover:bg-[#ff3535] p-[1rem] text-white font-bold rounded-2xl shadowBotonRegresarOrdenTrabajo mr-[3rem]"
              onClick={abrirModalCancelarOrdenTrabajo}
            >
              Cancelar
            </button>
            <button
              className="text-[2.2rem] bg-[#ff6b16] hover:bg-[#ff7425] p-[1rem] text-white font-bold rounded-2xl shadowBotonRegresarOrdenTrabajo"
              onClick={handleRegresar}
            >
              Regresar
            </button>
          </div>
        </footer>
      </div>

      <ModalFinalizarOrdenTrabajo
        isOpen={isModalOpen}
        onClose={closeModal}
        finalizarOrdenTrabajo={setFinOrdenTrabajo}
        row={
          especificacionesPedidosPerspectivas.length > 0
            ? especificacionesPedidosPerspectivas[0]
            : {
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
        row={
          especificacionesPedidosPerspectivas.length > 0
            ? especificacionesPedidosPerspectivas[0]
            : {
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
        sn_PantallaOrdenTrabajo={true}
      />
    </>
  );
};
