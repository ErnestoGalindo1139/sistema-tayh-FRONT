import { CustomSelectValue } from './interfacesGlobales';

export interface IFiltrosEnvios {
  id_Envio: string;
  id_Cliente: CustomSelectValue[] | string;
  clientes: string;
  de_Direccion: string;
  de_CorreoElectronico: string;
  nu_TelefonoCelular: string;
  nu_TelefonoRedLocal: string;
  de_FolioGuia: string;
  id_Estatus: string;
}

export interface IEnvios {
  id_Envio: number;
  id_Cliente: string;
  nb_Cliente?: string;
  de_Direccion: string;
  de_CorreoElectronico: string;
  nu_TelefonoCelular: string;
  nu_TelefonoRedLocal: string;
  de_FolioGuia: string;
  id_Estatus: number;
  de_Estatus?: string;
  color_Estatus?: string;
  fh_Registro?: string;
}

export interface IFormEnvios {
  id_Envio: number;
  id_Cliente: number;
  de_Direccion: string;
  de_CorreoElectronico: string;
  nu_TelefonoCelular: string;
  nu_TelefonoRedLocal: string;
  de_FolioGuia: string;
  id_Estatus: number;
}
