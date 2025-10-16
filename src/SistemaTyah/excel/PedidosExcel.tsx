import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getPedidosExcel } from '../helpers/apiPedidos';
import Toast from '../components/Toast';
import { IApiError } from '../interfaces/interfacesApi';
import { WaitScreen } from '../components/WaitScreen';
import { Tooltip } from 'flowbite-react';
import { ExcelIcon } from '../icons/ExcelIcon';
import {
  IFiltrosPedidos,
  IPedidosExcel,
} from '../interfaces/interfacesPedidos';
import { IEstatus } from '../interfaces/interfacesEstatus';

// Definición de estilos reutilizables para celdas (Estilos Globales)
const style = {
  title: {
    font: { bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF1F4E79' }, // Azul oscuro
    },
    alignment: { horizontal: 'center' as const },
  },
  borderLBR: {
    border: {
      left: { style: 'thin' as const, color: { argb: 'FF000000' } },
      bottom: { style: 'thin' as const, color: { argb: 'FF000000' } },
      right: { style: 'thin' as const, color: { argb: 'FF000000' } },
    },
  },
  body: {
    font: { size: 11 },
    alignment: { horizontal: 'left' as const },
    border: {
      top: { style: 'thin' as const, color: { argb: 'FF000000' } },
      left: { style: 'thin' as const, color: { argb: 'FF000000' } },
      bottom: { style: 'thin' as const, color: { argb: 'FF000000' } },
      right: { style: 'thin' as const, color: { argb: 'FF000000' } },
    },
  },
  filterRow: {
    font: { bold: true, size: 11, color: { argb: 'FF000000' } },
    alignment: { horizontal: 'left' as const },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9EAF7' }, // Azul claro
    },
  },
  number: {
    alignment: { horizontal: 'right' as const },
  },
  currency: {
    alignment: { horizontal: 'right' as const },
    numFmt: '"$"#,##0.00',
  },
  status: (
    id_Estatus: number,
    estatusArray: IEstatus[]
  ): Partial<ExcelJS.Style> => {
    const estatusEncontrado = estatusArray.find(
      (e) => e.id_Estatus == id_Estatus
    );

    return {
      alignment: { horizontal: 'center' as const },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: estatusEncontrado?.color_Estatus || 'FFFFFF00' }, // Usa el color si lo encuentra, de lo contrario amarillo
      },
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
    };
  },
};

// Definición de las columnas para el reporte
const columnas = [
  {
    title: 'ID Pedido',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 100 },
  },
  {
    title: 'Nombre Cliente',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 200 },
  },
  {
    title: 'Fecha Pedido',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 270 },
  },
  {
    title: 'Fecha Producción',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 270 },
  },
  {
    title: 'Fecha Entrega',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 200 },
  },
  {
    title: 'Concepto',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 200 },
  },
  {
    title: 'Genero',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Modelo',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Tipo Prenda',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Talla',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Color',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Tipo Tela',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Cantidad',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Precio',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Subtotal',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Impuesto',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Envío a Domicilio',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Total Pedido',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Estado del Pedido',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
];

interface IPedidosExcelProps {
  filtros: IFiltrosPedidos;
  estatus: IEstatus[];
}

export const PedidosExcel = ({
  filtros,
  estatus,
}: IPedidosExcelProps): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  // Llamada a la API para traer la información
  const fetchPedidos = async (): Promise<IPedidosExcel[]> => {
    try {
      setIsLoading(true);
      const pedidosData = await getPedidosExcel(filtros);
      return pedidosData.body;
    } catch (error) {
      const errorMessage =
        (error as IApiError).message || 'Ocurrió un error desconocido';
      Toast.fire({
        icon: 'error',
        title: 'Ocurrió un Error',
        text: errorMessage,
      });
      return []; // Devolver un arreglo vacío en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar imágenes como base64
  const loadImageAsBase64 = async (path: string): Promise<string> => {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject): void => {
      const reader = new FileReader();
      reader.onloadend = (): void => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Función principal para generar el archivo Excel
  const generateExcel = async (): Promise<void> => {
    const dataApi = await fetchPedidos();
    if (dataApi.length === 0) {
      Toast.fire({ icon: 'warning', title: 'No hay datos para exportar' });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // Cargar imagen y agregarla al Excel
    const base64Image = await loadImageAsBase64(
      'img/Logo-Tayh_Horizontal-Negro.png'
    );
    const logoId = workbook.addImage({
      base64: base64Image.split(',')[1],
      extension: 'png',
    });

    // Agregar la imagen y definir su tamaño en píxeles
    worksheet.addImage(logoId, {
      tl: { col: 1, row: 1.35 }, // Esquina superior izquierda
      ext: { width: 300, height: 70 }, // Tamaño en píxeles
    });

    // Definir los filtros como objetos
    const filtrosData = [
      {
        nb_Filtro1: 'Folio Pedido:',
        de_Filtro1: filtros.id_Pedido || 'Todos',
        nb_Filtro2: 'Folio Cliente:',
        de_Filtro2: filtros.id_Cliente || 'Todos',
        nb_Filtro3: 'Nombre Cliente:',
        de_Filtro3: filtros.nb_Cliente || 'Todos',
      },
      {
        nb_Filtro1: 'Estatus:',
        de_Filtro1: filtros.id_Estatus || 'Todos',
        nb_Filtro2: 'Fecha Inicio Producción:',
        de_Filtro2: filtros.fh_InicioEnvioProduccion || 'Todos',
        nb_Filtro3: 'Fecha Inicio Entrega Estimada:',
        de_Filtro3: filtros.fh_InicioEntregaEstimada || 'Todos',
      },
      {
        nb_Filtro1: 'Fecha Inicio Pedido:',
        de_Filtro1: filtros.fh_InicioPedido || 'Todos',
        nb_Filtro2: 'Fecha Fin Producción:',
        de_Filtro2: filtros.fh_FinEnvioProduccion || 'Todos',
        nb_Filtro3: 'Fecha Fin Entrega Estimada:',
        de_Filtro3: filtros.fh_FinEntregaEstimada || 'Todos',
      },
      {
        nb_Filtro1: 'Fecha Fin Pedido:',
        de_Filtro1: filtros.fh_FinPedido || 'Todos',
      },
    ];

    // Agregar los filtros
    filtrosData.forEach((filtro, index) => {
      const rowIndex = index + 2;

      // Agregar primera columna
      worksheet.getCell(`D${rowIndex}`).value = filtro.nb_Filtro1;
      worksheet.getCell(`E${rowIndex}`).value = filtro.de_Filtro1;

      // Agregar segunda columna
      worksheet.getCell(`F${rowIndex}`).value = filtro.nb_Filtro2;
      worksheet.getCell(`G${rowIndex}`).value = filtro.de_Filtro2;

      // Agregar tercera columna
      worksheet.getCell(`H${rowIndex}`).value = filtro.nb_Filtro3;
      worksheet.getCell(`I${rowIndex}`).value = filtro.de_Filtro3;

      // Estilos
      ['D', 'F', 'H'].forEach((col) => {
        worksheet.getCell(`${col}${rowIndex}`).style = {
          font: { bold: true, size: 12, color: { argb: 'FF000000' } },
          alignment: { horizontal: 'left' },
        };
      });

      ['E', 'G', 'I'].forEach((col) => {
        worksheet.getCell(`${col}${rowIndex}`).style = {
          font: { size: 12, color: { argb: 'FF000000' } },
          alignment: { horizontal: 'left' },
        };
      });
    });

    // Configurar Columnas
    columnas.forEach((col, index) => {
      const column = worksheet.getColumn(index + 1);
      column.width = col.width.wpx / 7;
    });

    // Agregar una fila vacía como espacio después de los filtros
    worksheet.addRow([]);

    // Calcular el número total de filas de los filtros (Depende de cada uno)
    const totalRows = 6;

    // Obtener el número de columnas dinámicamente
    const totalCols = columnas.length;

    // Aplicar fondo azul a todas las celdas superiores y filas de datos
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= totalCols; col++) {
        const cell = worksheet.getCell(row, col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DAEEF3' }, // Color azul claro
        };
      }
    }

    // Agregar Encabezados
    const headerRow = worksheet.addRow(columnas.map((col) => col.title));
    headerRow.eachCell((cell, colNumber) => {
      const colStyle = columnas[colNumber - 1].style;
      cell.style = colStyle;
    });

    // Agrupar los datos por id_Pedido
    const groupedData = dataApi.reduce(
      (acc, item) => {
        if (!acc[item.id_Pedido]) {
          acc[item.id_Pedido] = [];
        }
        acc[item.id_Pedido].push(item);
        return acc;
      },
      {} as Record<number, IPedidosExcel[]>
    );

    // Iterar sobre cada grupo de pedidos
    Object.values(groupedData).forEach((pedidoDetails) => {
      let totalSubtotal = 0;
      let totalPedido = 0;

      const impuesto = pedidoDetails[0].im_TotalImpuesto || 0;
      const envio = pedidoDetails[0].im_EnvioDomicilio || 0;

      // Agregar detalles del pedido
      pedidoDetails.forEach((item) => {
        const row = worksheet.addRow([
          item.id_Pedido,
          item.nb_Cliente,
          item.fh_PedidoFormat,
          item.fh_EnvioProduccionFormat,
          item.fh_EntregaEstimadaFormat,
          item.de_Concepto,
          item.de_GeneroCompleto,
          item.de_Modelo,
          item.de_TipoPrenda,
          item.de_Talla,
          item.de_Color,
          item.de_TipoTela,
          item.nu_Cantidad,
          item.im_PrecioUnitario,
          item.im_SubTotal,
          '',
          '',
          '',
          item.de_Estatus,
        ]);

        // Aplicar estilos dinámicos
        row.eachCell((cell, colNumber) => {
          const isNumber = [1, 13, 14, 15].includes(colNumber);
          const isCurrency = [14, 15].includes(colNumber);
          const isStatus = colNumber === 19;

          if (isStatus) {
            cell.style = {
              ...style.body,
              ...style.status(Number(item.id_Estatus), estatus),
            };
          } else if (isCurrency) {
            cell.style = { ...style.body, ...style.currency };
          } else if (isNumber) {
            cell.style = { ...style.body, ...style.number };
          } else {
            cell.style = style.body;
          }
        });

        totalSubtotal += item.im_SubTotal || 0;
      });

      totalPedido = totalSubtotal + impuesto + envio;

      // Agregar fila de totales para el pedido
      const totalRow = worksheet.addRow([
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        totalSubtotal,
        impuesto,
        envio,
        totalPedido,
        '',
      ]);

      totalRow.eachCell((cell) => {
        cell.style = {
          font: { bold: true, size: 11 },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E4E4E4' },
          },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
          alignment: { horizontal: 'right' },
          numFmt: '"$"#,##0.00',
        };
      });

      worksheet.addRow([]);
    });

    // Congelar hasta la fila de encabezado
    worksheet.views = [{ state: 'frozen', ySplit: 7, xSplit: 3 }];

    // Exportar Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'reporte_pedidos.xlsx');

    Toast.fire({ icon: 'success', title: 'Reporte generado exitosamente' });
  };

  return (
    <div>
      {isLoading && <WaitScreen message="Generando Excel..." />}

      <Tooltip
        content="Generar Reporte Pedidos"
        className="text-[1.3rem]"
        placement="bottom"
      >
        <button onClick={generateExcel}>
          <ExcelIcon width="4em" height="4em" />
        </button>
      </Tooltip>
    </div>
  );
};
