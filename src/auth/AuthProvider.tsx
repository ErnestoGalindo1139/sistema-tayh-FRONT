import React, { useContext, createContext, useState, useEffect } from 'react';
import {
  AccessTokenResponse,
  authLogin,
  AuthResponse,
  IUser,
} from '../interfaces/interfacesLogin';
import { ApiResponse } from '../SistemaTyah/interfaces/interfacesApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => {},
  saveUser: (userData: AuthResponse) => {},
  getRefreshToken: () => {},
  getUser: () => ({}) as IUser | undefined,
  setIsAuthenticated: (value: boolean) => {},
  requestNewAccessToken: async (refreshToken: string): Promise<string | null> =>
    null,
});

export const AuthProvider = ({
  children,
}: AuthProviderProps): React.JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [user, setUser] = useState<IUser>();
  // const [refreshToken, setRefreshToken] = useState<string>('');

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    checkAuth();
  }, []);

  const requestNewAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const data: ApiResponse<AccessTokenResponse> = await response.json();

      if (data.success) {
        if (data.body.error) {
          throw new Error(data.body.error);
        }

        return data.body.accessToken;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getUserInfo = async (accessToken: string) => {
    if (accessToken) {
      try {
        const response = await fetch(
          `${BASE_URL}/auth/getUsuarioInfoByAccessToken`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data: ApiResponse<IUser> = await response.json();

        return data.body;
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  };

  const checkAuth = async () => {
    if (accessToken) {
      // El usuario esta autenticado
    } else {
      // El usuario no esta autenticado
      const token = await getRefreshToken();
      if (token) {
        const newAccessToken = await requestNewAccessToken(token);
        if (newAccessToken) {
          const userInfo = await getUserInfo(token);
          if (userInfo) {
            saveSessionInfo(userInfo, newAccessToken, token);
          }
          setIsAuthenticated(true);
        }
      }
    }
  };

  const saveSessionInfo = (
    userInfo: IUser,
    accessToken: string,
    refreshToken: string
  ) => {
    setAccessToken(accessToken);
    setUser(userInfo);
    localStorage.setItem('token', JSON.stringify(refreshToken));
    setIsAuthenticated(true);
  };

  const getAccessToken = () => {
    return accessToken;
  };

  const getRefreshToken = (): string | null => {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      const token = JSON.parse(tokenData);
      return token;
    }

    return null;
  };

  const saveUser = (userData: AuthResponse) => {
    saveSessionInfo(
      userData.body.user,
      userData.body.accessToken,
      userData.body.refreshToken
    );
  };

  const getUser = () => {
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        getAccessToken,
        saveUser,
        getRefreshToken,
        getUser,
        setIsAuthenticated,
        requestNewAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
