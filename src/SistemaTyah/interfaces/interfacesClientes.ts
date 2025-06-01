// Interfaces Clientes
export interface IClientes {
  id_Cliente: string;
  nb_Cliente: string;
  de_Direccion: string;
  de_CorreoElectronico: string;
  de_FolioCliente: string;
  nb_Atendio: string;
  id_UsuarioRegistra: string;
  id_UsuarioModifica: string;
  id_UsuarioElimina: string;
  fh_Cumpleanos: string;
  fh_CumpleanosEmpresa: string;
  fh_CumpleanosFormat?: string;
  fh_CumpleanosEmpresaFormat?: string;
  redesSociales: IRedSocial[]; // Arreglo de redes sociales, usando la nueva interfaz
  nu_TelefonoRedLocal: string;
  nu_TelefonoCelular: string;
  nu_TelefonoWhatsApp: string;
  fh_Registro: string;
  fh_Modificacion: string;
  fh_Eliminacion: string;
  sn_Activo: boolean | null;
}

export interface IFormClientes {
  id_Cliente: string;
  nb_Cliente: string;
  de_Direccion: string;
  de_CorreoElectronico: string;
  de_FolioCliente: string;
  nb_Atendio: string;
  id_UsuarioRegistra: string;
  id_UsuarioModifica: string;
  id_UsuarioElimina: string;
  fh_Cumpleanos: string;
  fh_CumpleanosEmpresa: string;
  nu_TelefonoRedLocal: string;
  nu_TelefonoCelular: string;
  nu_TelefonoWhatsApp: string;
  redesSociales: IRedSocial[]; // Arreglo de redes sociales, usando la nueva interfaz
  fh_Registro: string;
  fh_Modificacion: string;
  fh_Eliminacion: string;
  sn_Activo: boolean | null;
}

export interface IFiltrosClientes {
  id_Cliente: string;
  nb_Cliente: string;
  // de_Direccion: string;
  // de_CorreoElectronico: string;
  // de_FolioCliente: string;
  // nb_Atendio: string;
  // id_UsuarioRegistra: string;
  // id_UsuarioModifica: string;
  // id_UsuarioElimina: string;
  fh_Cumpleanos: string;
  // fh_CumpleanosEmpresa: string;
  // nu_TelefonoRedLocal: string;
  // nu_TelefonoCelular: string;
  // nu_TelefonoWhatsApp: string;
  // fh_Registro: string;
  // fh_Modificacion: string;
  // fh_Eliminacion: string;
  sn_Activo: string;
}

export interface IRedSocial {
  id_RedSocial?: string; // Campo opcional porque puede no estar definido al crear una nueva red social
  de_RedSocial: string; // Nombre de la red social (e.g., Facebook, Twitter)
  de_Enlace: string; // Enlace a la red social
}

export interface IClientesCombo {
  id_Cliente?: string;
  nb_Cliente?: string;
  sn_Activo?: boolean | null;
}
export interface ICumpleanosClientes {
  id_Cliente?: string;
  nb_Cliente?: string;
  nu_DiasParaCumpleanos: number;
  mensaje: string;
}

export interface IClienteInfo {
  id_Cliente: number;
  nb_Cliente: string;
  de_Direccion: string;
  de_CorreoElectronico: string;
  nu_TelefonoRedLocal: string;
  nu_TelefonoCelular: string;
  nu_TelefonoWhatsApp: string;
}
