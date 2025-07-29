/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Modal } from 'flowbite-react';
import { ICumpleanosClientes } from '../interfaces/interfacesClientes';
import React, { useState } from 'react';
import {
  FaBirthdayCake,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaGift,
  FaRegSmileBeam,
  FaMapMarkerAlt,
  FaUserTie,
  FaWhatsapp,
  FaUserCheck,
  FaUserEdit,
  FaUserTimes,
  FaClock,
} from 'react-icons/fa';
import {
  MdOutlineContactMail,
  MdOutlineToday,
  MdBusiness,
} from 'react-icons/md';
import { GiPresent } from 'react-icons/gi';
import { BsCalendarDate, BsCalendar2Date } from 'react-icons/bs';

interface Props {
  open: boolean;
  onClose: () => void;
  cliente: ICumpleanosClientes | null;
}

export const ModalInfoCliente = ({
  open,
  onClose,
  cliente,
}: Props): React.JSX.Element => {
  // Estado para manejar las acciones
  const [actions, setActions] = useState({
    whatsapp: false,
    email: false,
    call: false,
    reminder: false,
  });

  if (!cliente) return <></>;

  // Función para formatear números de teléfono
  const formatPhone = (phone: string) => {
    if (!phone) return 'No disponible';
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
  };

  // Funciones para manejar las acciones
  const handleWhatsApp = () => {
    setActions({ ...actions, whatsapp: true });
    try {
      const telefono = cliente.nu_TelefonoWhatsApp.replace(/\D/g, '');
      const nombre = cliente.nb_Cliente;
      const mensaje = `Hola ${nombre}, ¡te deseamos un muy feliz cumpleaños! 🎉🎂 Como regalo, te damos un cupón de 10% de descuento: CUPON10.`;

      const url = `https://web.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setActions({ ...actions, call: false });
      }, 10000);
    }
  };

  const handleEmail = () => {
    setActions({ ...actions, email: true });
    // Lógica para enviar email
    console.log('Enviando cupón por email...');
    setTimeout(() => {
      setActions({ ...actions, email: false });
      alert('Cupón enviado por email');
    }, 1000);
  };

  const handleCall = () => {
    setActions({ ...actions, call: true });
    // Lógica para llamar
    console.log('Llamando al cliente...');
    setTimeout(() => {
      setActions({ ...actions, call: false });
      alert('Llamada realizada');
    }, 1000);
  };

  const handleReminder = () => {
    setActions({ ...actions, reminder: true });
    // Lógica para recordatorio
    console.log('Programando recordatorio...');
    setTimeout(() => {
      setActions({ ...actions, reminder: false });
      alert('Recordatorio programado');
    }, 1000);
  };

  return (
    <Modal show={open} onClose={onClose} className="z-[500]" size="5xl">
      <Modal.Header className="border-b-0 pb-0">
        <div className="flex items-center space-x-3">
          <FaBirthdayCake className="text-pink-500 text-3xl" />
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              ¡Próximo Cumpleaños!
            </h3>
            <p className="text-sm text-gray-500">
              Detalles completos del cliente
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {/* Sección de información principal */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="bg-pink-100 p-3 rounded-full">
                  <FaRegSmileBeam className="text-pink-600 text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {cliente.nb_Cliente || 'Nombre no disponible'}
                  </h2>
                  <p className="text-gray-600">
                    Folio: {cliente.id_Cliente || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                  <MdOutlineToday className="text-purple-600 text-xl" />
                  <div>
                    <p className="text-[1rem] text-gray-500">Días faltantes</p>
                    <p className="text-[1.2rem] font-semibold">
                      {cliente.nu_DiasParaCumpleanos == 0
                        ? 'Hoy es su cumpleaños'
                        : `${cliente.nu_DiasParaCumpleanos} días`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                  <BsCalendarDate className="text-pink-600 text-xl" />
                  <div>
                    <p className="text-[1rem] text-gray-500">
                      Fecha cumpleaños
                    </p>
                    <p className="font-semibold text-[1.2rem]">
                      {cliente.fh_CumpleanosFormat ||
                        cliente.fh_Cumpleanos ||
                        'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de mensaje */}
          {cliente.mensaje && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start space-x-3">
                <FaEnvelope className="text-blue-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    Mensaje personalizado
                  </p>
                  <p className="text-gray-600 italic">"{cliente.mensaje}"</p>
                </div>
              </div>
            </div>
          )}

          {/* Sección de información de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda - Contacto */}
            <div className="space-y-4">
              <h4 className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                <MdOutlineContactMail className="text-gray-600" />
                <span>Información de contacto</span>
              </h4>

              <div className="space-y-3">
                {cliente.de_Direccion && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-red-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="font-medium">{cliente.de_Direccion}</p>
                    </div>
                  </div>
                )}

                {cliente.de_CorreoElectronico && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Correo electrónico
                      </p>
                      <p className="font-medium">
                        {cliente.de_CorreoElectronico}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {cliente.nu_TelefonoRedLocal && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Teléfono local</p>
                        <p className="font-medium">
                          {formatPhone(cliente.nu_TelefonoRedLocal)}
                        </p>
                      </div>
                    </div>
                  )}

                  {cliente.nu_TelefonoCelular && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Teléfono celular
                        </p>
                        <p className="font-medium">
                          {formatPhone(cliente.nu_TelefonoCelular)}
                        </p>
                      </div>
                    </div>
                  )}

                  {cliente.nu_TelefonoWhatsApp && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaWhatsapp className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">WhatsApp</p>
                        <p className="font-medium">
                          {formatPhone(cliente.nu_TelefonoWhatsApp)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Información adicional */}
            <div className="space-y-4">
              <h4 className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                <MdBusiness className="text-gray-600" />
                <span>Información adicional</span>
              </h4>

              <div className="space-y-3">
                {cliente.nb_Atendio && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaUserTie className="text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Atendió</p>
                      <p className="font-medium">{cliente.nb_Atendio}</p>
                    </div>
                  </div>
                )}

                {cliente.fh_CumpleanosEmpresaFormat && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <BsCalendar2Date className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Cumpleaños empresa
                      </p>
                      <p className="font-medium">
                        {cliente.fh_CumpleanosEmpresaFormat}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaUserCheck className="text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Registrado por</p>
                      <p className="font-medium">
                        {cliente.id_UsuarioRegistra || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaClock className="text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha registro</p>
                      <p className="font-medium">
                        {cliente.fh_Registro || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {cliente.fh_Modificacion && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaUserEdit className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Última modificación
                        </p>
                        <p className="font-medium">{cliente.fh_Modificacion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones destacadas */}
          <div className="border-t"></div>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-pink-100 p-1 rounded">
                <FaGift className="text-pink-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-700">
                OPCIONES DE REGALO
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Botón WhatsApp */}
              <button
                onClick={handleWhatsApp}
                disabled={actions.whatsapp}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-all border ${
                  actions.whatsapp
                    ? 'bg-green-100 border-green-300'
                    : 'bg-white border-gray-100 hover:border-green-300 hover:bg-green-50 hover:shadow-md transform hover:-translate-y-0.5'
                }`}
              >
                <FaWhatsapp
                  size="12"
                  className={`${actions.whatsapp ? 'text-green-600' : 'text-green-500'}`}
                />
                <span className="text-sm font-medium">
                  {actions.whatsapp ? 'Enviando...' : 'Felicitar por WhatsApp'}
                </span>
              </button>

              {/* Botón Email */}
              <button
                onClick={handleEmail}
                disabled={actions.email}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-all border ${
                  actions.email
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-white border-gray-100 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transform hover:-translate-y-0.5'
                }`}
              >
                <FaEnvelope
                  size="12"
                  className={`${actions.email ? 'text-blue-600' : 'text-blue-500'}`}
                />
                <span className="text-sm font-medium">
                  {actions.email ? 'Enviando...' : 'Enviar cupón por Email'}
                </span>
              </button>

              {/* Botón Llamada */}
              <button
                onClick={handleCall}
                disabled={actions.call}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-all border ${
                  actions.call
                    ? 'bg-purple-100 border-purple-300'
                    : 'bg-white border-gray-100 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md transform hover:-translate-y-0.5'
                }`}
              >
                <FaPhone
                  size="12"
                  className={`${actions.call ? 'text-purple-600' : 'text-purple-500'}`}
                />
                <span className="text-sm font-medium">
                  {actions.call ? 'Llamando...' : 'Llamar por teléfono'}
                </span>
              </button>

              {/* Botón Recordatorio */}
              <button
                onClick={handleReminder}
                disabled={actions.reminder}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-all border ${
                  actions.reminder
                    ? 'bg-yellow-100 border-yellow-300'
                    : 'bg-white border-gray-100 hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md transform hover:-translate-y-0.5'
                }`}
              >
                <FaClock
                  size="12"
                  className={`${actions.reminder ? 'text-yellow-600' : 'text-yellow-500'}`}
                />
                <span className="text-sm font-medium">
                  {actions.reminder ? 'Programando...' : 'Recordatorio'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
