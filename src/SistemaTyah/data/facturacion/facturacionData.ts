import { IFacturacion } from '../../interfaces/interfacesFacturacion';

export const columns: {
  id: keyof IFacturacion;
  texto: string;
  visible: boolean;
  width: string;
  bgColor?: string;
  textAlign?: string;
}[] = [
  { id: 'id_Factura', texto: 'Folio Factura', visible: true, width: '1%' },
  {
    id: 'id_Pedido',
    texto: 'Folio Pedido',
    visible: true,
    width: '1%',
  },
  {
    id: 'nb_Cliente',
    texto: 'Cliente',
    visible: true,
    width: '15%',
  },
  {
    id: 'de_Domicilio',
    texto: 'Domicilio',
    visible: true,
    width: '19%',
  },
  {
    id: 'nu_Telefono',
    texto: 'Telefono Celular',
    visible: true,
    width: '8%',
  },
  {
    id: 'de_CorreoElectronico',
    texto: 'Correo Electrónico',
    visible: true,
    width: '14%',
  },
  {
    id: 'de_RFC',
    texto: 'RFC',
    visible: true,
    width: '8%',
  },
  {
    id: 'de_Regimen',
    texto: 'Régimen',
    visible: true,
    width: '14%',
  },
  {
    id: 'de_Uso',
    texto: 'Uso',
    visible: true,
    width: '5%',
  },
  {
    id: 'nb_ConstanciaFiscal',
    texto: 'Constancia Fiscal',
    visible: true,
    textAlign: 'center',
    width: '1%',
  },
  {
    id: 'sn_Activo',
    texto: 'Estado de la Factura',
    visible: true,
    width: '6%',
  },
];
