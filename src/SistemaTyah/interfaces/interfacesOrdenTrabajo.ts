import { CustomSelectValue } from './interfacesGlobales';

export interface IFiltrosOrdenTrabajo {
  id_Pedido?: CustomSelectValue[] | string;
  pedidos?: string;
  id_Estatus?: CustomSelectValue[] | string;
  estatus?: string;
  fh_Inicio?: string;
  fh_Fin?: string;
}

export interface IOrdenesTrabajo {
  id_OrdenTrabajo: number;
  id_Pedido: number;
  id_Estatus: number;
  pedidos: string;
  estatus: string;
  id_Cliente: number;
  fh_Pedido: string;
  fh_Registro: string;
  fh_Finalizacion: string;
  nu_Cantidad: number;
  nu_CantidadPendiente: number;
  nb_Cliente: string;
  de_Modelo: string;
  de_Genero: string;
  de_ColorTela: string;
  de_Estatus: string;
  color_Estatus: string;
  de_Talla: string;
  de_ComentarioCancelacion: string;
}

export interface IOrdenTrabajoCombo {
  id_Pedido: string;
  id_Cliente: string;
  nb_Cliente: string;
  id_Estatus: string;
  de_OrdenTrabajo: string;
}

export interface IEspecificacionesOrdenTrabajoParams {
  id_OrdenTrabajo: number | string;
}

export interface IEspecificacionesOrdenTrabajo {
  id_OrdenTrabajo: number;
  de_ColorTela: string;
  nu_Cantidad: number;
  nu_CantidadPendiente: number;
  de_Modelo: string;
  de_TipoTela: string;
  de_Talla: string;
  de_Genero: string;
  id_Especificacion: number;
  nu_Especificacion: number;
  de_Especificacion: string;
  id_ModeloImagen: number;
  id_ModeloPerspectiva: number;
  totalModeloPerspectiva: number;
  de_Ruta: string;
  sn_ActivoImagen: number;
}

export interface IFormFinalizarOrdenTrabajo {
  id_OrdenTrabajo: number;
  nu_CantidadPendiente: number;
  sn_OrdenFinalizada: number;
}

export interface IFormCancelarOrdenTrabajo {
  id_OrdenTrabajo: number;
  de_ComentarioCancelacion: string;
}
