export interface IPrecios {
  id_Precio: number;
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
  de_Genero: string;
  id_TipoPrenda: number;
  id_Talla: number;
  im_PrecioUnitario: number;
}

export interface IFiltrosPrecios {
  de_Genero: string;
  id_TipoPrenda: number;
  id_Talla: number;
  im_PrecioMinimo: number;
  im_PrecioMaximo: number;
}
