import { CustomSelectValue } from './interfacesGlobales';

export interface IFiltrosFacturacion {
  id_Factura: string;
  id_Pedido: string;
  id_Cliente: CustomSelectValue[] | string;
  clientes: string;
  de_Domicilio: string;
  nu_Telefono: string;
  de_CorreoElectronico: string;
  de_RFC: string;
  de_Regimen: string;
  de_Uso: string;
  sn_ConstanciaFiscal: boolean | null;
  sn_Activo: boolean | null;
}

export interface IFacturacion {
  id_Factura: number;
  id_Pedido: number;
  id_Cliente: number;
  nb_Cliente?: string;
  de_Domicilio: string;
  nu_Telefono: string;
  de_CorreoElectronico: string;
  de_RFC: string;
  de_Regimen: string;
  de_Uso: string;
  nb_ConstanciaFiscal?: string;
  sn_ConstanciaFiscal: boolean | null;
  sn_Activo: boolean | null;
}

export interface IFormFacturacion {
  id_Factura: number;
  id_Pedido: CustomSelectValue[] | number;
  pedidos?: string;
  id_Cliente: number;
  de_Domicilio: string;
  nu_Telefono: string;
  de_CorreoElectronico: string;
  de_RFC: string;
  de_Regimen: string;
  de_Uso: string;
  sn_ConstanciaFiscal: boolean | null;
  sn_Activo: boolean | null;
}
