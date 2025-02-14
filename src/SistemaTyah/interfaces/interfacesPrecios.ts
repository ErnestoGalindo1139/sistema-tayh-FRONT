export interface IPrecios {
  id_Precio: number;
  id_Modelo: number;
  de_Modelo: string;
  de_Genero: string;
  de_GeneroCompleto: string;
  id_TipoPrenda: number;
  de_TipoPrenda: string;
  id_Talla: number;
  de_Talla: string;
  im_PrecioUnitario: number;
}

export interface IFormPrecios {
  id_Precio?: number;
  id_Modelo: number;
  de_Genero: string;
  id_TipoPrenda: number;
  id_Talla: number;
  im_PrecioUnitario: number;
}

export interface IFiltrosPrecios {
  id_Modelo: number;
  de_Genero: string;
  id_TipoPrenda: number;
  id_Talla: number;
  im_PrecioMinimo: string;
  im_PrecioMaximo: string;
}
