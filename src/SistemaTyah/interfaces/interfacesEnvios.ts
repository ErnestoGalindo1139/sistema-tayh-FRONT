export interface IFiltrosEnvios {
  id_Envio: string;
  nb_Destinatario: string;
  de_Direccion: string;
  de_CorreoElectronico: string;
  nu_TelefonoCelular: string;
  nu_TelefonoRedLocal: string;
  de_FolioGuia: string;
}

export interface IEnvios {
  id_Envio: number;
  id_Cliente: number;
  nb_Destinatario: string;
  de_Direccion: string;
  de_CorreoElectronico: string;
  nu_TelefonoCelular: string;
  nu_TelefonoRedLocal: string;
  de_FolioGuia: string;
}

export interface IFormEnvios {
  id_Envio: number;
  id_Cliente: number;
  nb_Destinatario: string;
  de_Direccion: string;
  de_CorreoElectronico: string;
  nu_TelefonoCelular: string;
  nu_TelefonoRedLocal: string;
  de_FolioGuia: string;
}
