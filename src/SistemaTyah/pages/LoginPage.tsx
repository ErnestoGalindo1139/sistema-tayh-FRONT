import React from 'react';

export const LoginPage = (): React.JSX.Element => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
        <div className="m-auto w-full">
          <form className="flex flex-col justify-self-center w-3/4 2xl:w-2/4 xl:pl-[4.8rem]">
            <h2 className="text-left text-[3.7rem] font-bold mt-[10rem] lg:mt-0">
              Bienvenido 👋
            </h2>

            <p className="text-justify mt-2 text-[1.9rem]">
              Ingrese su correo y su contraseña para controlar los pedidos de
              sus filipinas
            </p>

            <label
              htmlFor="usuario"
              className="mt-[3.2rem] mb-[.5rem] text-[1.8rem] font-bold"
            >
              Usuario:
            </label>

            <input
              type="text"
              id="usuario"
              className="border-2 border-neutral-200 p-[.8rem] rounded-2xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none text-[1.6rem]"
              placeholder="correo@gmail.com"
            />

            <label
              htmlFor="usuario"
              className="mt-[1.6rem] mb-[.5rem] text-[1.8rem] font-bold"
            >
              Contraseña:
            </label>

            <input
              type="text"
              className="border-2 border-neutral-200 p-[.8rem] rounded-2xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none text-[1.6rem]"
              placeholder="Minimo 12 caracteres"
            />

            <p className="text-end mt-2 text-blue-500 cursor-pointer text-[1.6rem]">
              Olvidé mi contraseña?
            </p>

            <button className="relative bg-slate-800 text-white p-[1rem] text-[1.9rem] mt-[2rem] rounded-2xl font overflow-hidden group">
              <span className="absolute inset-0 bg-slate-700 transform scale-0 origin-center transition-all duration-500 ease-in-out group-hover:scale-100 rounded-xl"></span>
              <span className="relative z-10">Iniciar Sesión</span>
            </button>

            <p className="text-center mt-[4.8rem] text-[1.6rem]">
              No tengo una cuenta?{' '}
              <span className="text-blue-500 cursor-pointer">
                Solicitar cuenta
              </span>
            </p>

            <p className="text-center text-[1.6rem] mt-[9.6rem] text-slate-400">
              @ 2025 Todos los derechos reservados
            </p>
          </form>
        </div>
        <div className="w-full h-screen hidden lg:block">
          <img
            src="./assets/imageLogin.png"
            alt="imageLogin"
            className="p-[1.6rem] object-cover h-auto xl:h-[90%] 2xl:h-full mx-auto"
          />
        </div>
      </div>
    </>
  );
};
