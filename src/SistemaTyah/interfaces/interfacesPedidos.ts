// Interfaces Pedidos
export interface IPedidos {
  id_Pedido: number;
  id_Cliente: number;
  nb_Cliente: string;
  fh_Pedido: string;
  fh_EnvioProduccion: string;
  fh_EntregaEstimada: string;
  fh_PedidoFormat?: string;
  fh_EnvioProduccionFormat?: string;
  fh_EntregaEstimadaFormat?: string;
  id_ViaContacto: number;
  de_ViaContacto: string;
  id_Estatus: string | number;
  de_Estatus: string;
  id_Modelo: string;
  id_Talla: string;
  id_Color: string;
  id_TipoTela: string;
  id_TipoPrenda: string;
  de_Concepto: string;
  nu_Cantidad: number;
  im_PrecioUnitario: number;
  im_SubTotal: number;
  im_Impuesto: number;
  im_TotalImpuesto: number;
  im_TotalPedido: number;
  de_Genero: string;
  pedidosDetalles: IPedidosDetalles[];
}

export interface IPedidosDetalles {
  id_Detalle: number;
  id_Pedido: number;
  id_Modelo: string;
  id_Talla: string;
  id_Color: string;
  id_TipoTela: string;
  id_TipoPrenda: string;
  de_Concepto: string;
  nu_Cantidad: number;
  im_PrecioUnitario: number;
  im_SubTotal: number;
  im_Impuesto: number;
  im_Total: number;
  de_Genero: string;
  de_GeneroCompleto: string;
  de_Modelo: string;
  de_Talla: string;
  de_Color: string;
  de_TipoTela: string;
  de_TipoPrenda: string;
}

export interface IFormPedidos {
  id_Pedido: number;
  id_Cliente: number;
  fh_Pedido: string;
  fh_EnvioProduccion: string;
  fh_EntregaEstimada: string;
  id_ViaContacto: number;
  de_ViaContacto: string;
  id_Estatus: string | number;
  de_Estatus: string;
  im_Impuesto: number;
  im_TotalImpuesto: number;
  im_SubTotal: number;
  im_TotalPedido: number;
  im_EnvioDomicilio?: number;
  sn_EnvioDomicilio?: number;
  pedidosDetalles: IPedidosDetalles[];
}

export interface IFormPedidosDetalle {
  id_Detalle: number;
  id_Pedido: number;
  id_Modelo: string;
  id_Talla: string;
  id_Color: string;
  id_TipoTela: string;
  id_TipoPrenda: string;
  de_Concepto: string;
  nu_Cantidad: number;
  im_PrecioUnitario: number;
  im_SubTotal: number;
  im_Impuesto: number;
  im_Total: number;
  de_Genero: string;
  de_GeneroCompleto: string;
  de_Modelo: string;
  de_Talla: string;
  de_Color: string;
  de_TipoTela: string;
  de_TipoPrenda: string;
}

export interface IFiltrosPedidos {
  id_Pedido: string;
  id_Cliente: string;
  nb_Cliente: string;
  fh_InicioPedido: string;
  fh_FinPedido: string;
  fh_InicioEnvioProduccion: string;
  fh_FinEnvioProduccion: string;
  fh_InicioEntregaEstimada: string;
  fh_FinEntregaEstimada: string;
  id_Estatus: string;
}

// export interface IViaContacto {
//   id_ViaContacto: number;
//   id_Cliente: number;
//   de_ViaContacto: string;
// }

export interface IModelos {
  id_Modelo: string;
  de_Modelo: string;
  de_Genero: string;
  de_GeneroCompleto: string;
}

export interface ITallas {
  id_Talla: string;
  de_Talla: string;
}

export interface IColores {
  id_Color: string;
  de_ColorTela: string;
}

export interface ITipoTelas {
  id_TipoTela: string;
  de_TipoTela: string;
}

export interface ITipoPrendas {
  id_TipoPrenda: string;
  de_TipoPrenda: string;
}

export interface IViaContactoCombo {
  id_ViaContacto: number;
  de_ViaContacto: string;
}

export interface IPedidosDisponiblesComboParams {
  sn_Todos?: number;
  id_Cliente?: number;
}

export interface IPedidosDisponiblesCombo {
  id_Pedido?: string;
  id_Cliente?: string;
  de_Pedido?: string;
  de_CorreoElectronico?: string;
  nu_Telofono?: string;
}
