export interface IFiltrosInventarios {
  id_Inventario: string;
  id_Modelo: number;
  id_Talla: number;
  id_Color: number;
  id_TipoPrenda: number;
  de_Genero: string;
  de_GeneroCompleto: string;
  nu_Cantidad: string;
}

export interface IFormInventarios {
  id_Inventario?: string;
  id_Modelo: string;
  id_Talla: string;
  id_Color: string;
  id_TipoPrenda: string;
  de_Genero: string;
  de_GeneroCompleto: string;
  nu_Cantidad: string;
  sn_Activo: boolean;
  fh_Registro: string;
  fh_Actualizacion: string;
}

export interface IInventarios {
  id_Inventario: string;
  id_Modelo: string;
  id_Talla: string;
  id_Color: string;
  id_TipoPrenda: string;
  de_Modelo: string;
  de_Talla: string;
  de_Color: string;
  de_TipoPrenda: string;
  de_Genero: string;
  de_GeneroCompleto: string;
  nu_Cantidad: string;
  sn_Activo: boolean;
  fh_Registro: string;
  fh_Actualizacion: string;
}
