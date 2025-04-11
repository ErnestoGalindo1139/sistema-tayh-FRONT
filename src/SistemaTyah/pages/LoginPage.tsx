import React from 'react';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../../auth/AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { authLogin, AuthResponse } from '../../interfaces/interfacesLogin';
import { ApiResponse } from '../interfaces/interfacesApi';
import Toast from '../components/Toast';

export const LoginPage = (): React.JSX.Element => {
  const { formState, setFormState, onInputChange, onResetForm } = useForm({
    usuario: '',
    password: '',
  });

  const navigate = useNavigate();

  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState), // Mandar los filtros en la petición
      });

      const data: ApiResponse<authLogin> = await response.json();

      if (data.success) {
        console.log('Inicio de Sesion Exitoso');

        const json = data as unknown as AuthResponse;

        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json);
        }

        navigate('/dashboard');

        // Mostrar mensaje de éxito
        Toast.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido de nuevo!',
        });
      } else {
        console.log('Inicio de Sesion Fallido');
        // Mostrar mensaje de éxito
        Toast.fire({
          icon: 'error',
          title: 'Inicio de Sesion Fallido',
          text: 'Intente de nuevo',
        });
      }
    } catch (error) {
      console.error('Error al iniciar sesion:', error);
      Toast.fire({
        icon: 'error',
        title: 'Ocurrio un error al iniciar sesion',
        text: error as string,
      });
      throw error;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
        <div className="m-auto w-full">
          <form
            className="flex flex-col justify-self-center w-3/4 2xl:w-2/4 xl:pl-[4.8rem]"
            onSubmit={handleLogin}
          >
            <h2 className="text-left text-[3.7rem] font-bold mt-[10rem] lg:mt-0">
              Bienvenido 👋
            </h2>

            <p className="text-justify mt-2 text-[1.9rem]">
              Ingrese su usuario y su contraseña para controlar los pedidos de
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
              name="usuario"
              className="border-2 border-neutral-200 p-[.8rem] rounded-2xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none text-[1.6rem]"
              placeholder="Ingrese su usuario"
              onChange={onInputChange}
              value={formState.usuario}
            />

            <label
              htmlFor="password"
              className="mt-[1.6rem] mb-[.5rem] text-[1.8rem] font-bold"
            >
              Contraseña:
            </label>

            <input
              type="password"
              id="password"
              name="password"
              className="border-2 border-neutral-200 p-[.8rem] rounded-2xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none text-[1.6rem]"
              placeholder="Ingrese su contraseña"
              onChange={onInputChange}
              value={formState.password}
            />

            {/* <p className="text-end mt-2 text-blue-500 cursor-pointer text-[1.6rem]">
              Olvidé mi contraseña?
            </p> */}

            <button className="relative bg-slate-800 text-white p-[1rem] text-[1.9rem] mt-[2rem] rounded-2xl font overflow-hidden group">
              <span className="absolute inset-0 bg-slate-700 transform scale-0 origin-center transition-all duration-500 ease-in-out group-hover:scale-100 rounded-xl"></span>
              <span className="relative z-10">Iniciar Sesión</span>
            </button>

            {/* <p className="text-center mt-[4.8rem] text-[1.6rem]">
              No tengo una cuenta?{' '}
              <span className="text-blue-500 cursor-pointer">
                Solicitar cuenta
              </span>
            </p> */}

            <p className="text-center text-[1.6rem] mt-[9.6rem] text-slate-400">
              @ 2025 Todos los derechos reservados
            </p>
          </form>
        </div>
        <div className="w-full h-screen hidden lg:block">
          <img
            src="./img/imageLogin.png"
            alt="imageLogin"
            className="p-[1.6rem] object-cover h-auto xl:h-[90%] 2xl:h-full mx-auto"
          />
        </div>
      </div>
    </>
  );
};
