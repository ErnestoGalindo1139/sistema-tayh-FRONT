import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Toast from '../components/Toast';
import { IApiError } from '../interfaces/interfacesApi';
import { WaitScreen } from '../components/WaitScreen';
import { Tooltip } from 'flowbite-react';
import { ExcelIcon } from '../icons/ExcelIcon';
import { IEstatus } from '../interfaces/interfacesEstatus';
import {
  IFacturacion,
  IFiltrosFacturacion,
} from '../interfaces/interfacesFacturacion';
import { getFacturasExcel } from '../helpers/facturacion/apiFacturacion';

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
    title: 'Folio Factura',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 100 },
  },
  {
    title: 'Folio Pedido',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 200 },
  },
  {
    title: 'RFC',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 270 },
  },
  {
    title: 'Estatus',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 270 },
  },
  {
    title: 'Régimen',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 200 },
  },
  {
    title: 'Cliente',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 200 },
  },
  {
    title: 'Domicilio',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Constancia Fiscal',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
];

interface IFacturacionExcelProps {
  filtros: IFiltrosFacturacion;
}

export const FacturasExcel = ({
  filtros,
}: IFacturacionExcelProps): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  // Llamada a la API para traer la información
  const fetchFacturas = async (): Promise<IFacturacion[]> => {
    try {
      setIsLoading(true);
      const enviosData = await getFacturasExcel(filtros);
      return enviosData.body;
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
    const dataApi = await fetchFacturas();
    if (dataApi.length === 0) {
      Toast.fire({ icon: 'warning', title: 'No hay datos para exportar' });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // Cargar imagen y agregarla al Excel
    const base64Image = await loadImageAsBase64(
      '/public/img/Logo-Tayh_Horizontal-Negro.png'
    );
    const logoId = workbook.addImage({
      base64: base64Image.split(',')[1],
      extension: 'png',
    });

    // Agregar la imagen y definir su tamaño en píxeles
    worksheet.addImage(logoId, {
      tl: { col: 1, row: 0.5 }, // Esquina superior izquierda
      ext: { width: 300, height: 70 }, // Tamaño en píxeles
    });

    // Definir los filtros como objetos
    const filtrosData = [
      {
        nb_Filtro1: 'Folio Factura:',
        de_Filtro1: filtros.id_Factura || 'Todos',
        nb_Filtro2: 'Folio Pedido:',
        de_Filtro2: filtros.id_Pedido || 'Todos',
      },
      {
        nb_Filtro1: 'RFC:',
        de_Filtro1: filtros.de_RFC || 'Todas',
        nb_Filtro2: 'Estatus:',
        de_Filtro2:
          filtros.sn_Activo == true
            ? 'Activo'
            : filtros.sn_Activo == false
              ? 'Inactivo'
              : 'Todos',
      },
      {
        nb_Filtro1: 'Régimen:',
        de_Filtro1: filtros.de_Regimen || 'Todos',
        nb_Filtro2: 'Cliente:',
        de_Filtro2: filtros.id_Cliente || 'Todos',
      },
      {
        nb_Filtro1: 'Domicilio:',
        de_Filtro1: filtros.de_Domicilio || 'Todos',
        nb_Filtro2: 'Constancia Fiscal:',
        de_Filtro2:
          filtros.sn_ConstanciaFiscal == true
            ? 'Activo'
            : filtros.sn_ConstanciaFiscal == false
              ? 'Inactivo'
              : 'Todos',
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
      worksheet.getCell(`G${rowIndex}`).value = Array.isArray(filtro.de_Filtro2)
        ? filtro.de_Filtro2.map((item) => item.toString()).join(', ')
        : filtro.de_Filtro2;

      // Estilos
      ['D', 'F'].forEach((col) => {
        worksheet.getCell(`${col}${rowIndex}`).style = {
          font: { bold: true, size: 12, color: { argb: 'FF000000' } },
          alignment: { horizontal: 'left' },
        };
      });

      ['E', 'G'].forEach((col) => {
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

    // Agregar Datos
    dataApi.forEach((item) => {
      const row = worksheet.addRow([
        item.id_Factura,
        item.id_Pedido,
        item.de_RFC || '',
        item.sn_Activo ? 'Activo' : 'Inactivo',
        item.de_Regimen || '',
        item.nb_Cliente || '',
        item.de_Domicilio || '',
        item.nb_ConstanciaFiscal,
      ]);

      row.eachCell((cell, colNumber) => {
        const isNumber = [1, 5, 6, 7, 8, 9].includes(colNumber);

        if (isNumber) {
          cell.style = { ...style.body, ...style.number };
        } else {
          cell.style = style.body;
        }

        if (cell.address.startsWith('J')) {
          cell.alignment = { wrapText: true }; // Ajustar texto si hay saltos de línea
        }
      });
    });

    // Congelar hasta la fila de encabezado
    worksheet.views = [{ state: 'frozen', ySplit: 6 }];

    // Exportar Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'reporte_facturas.xlsx');

    Toast.fire({ icon: 'success', title: 'Reporte generado exitosamente' });
  };

  return (
    <div>
      {isLoading && <WaitScreen message="Generando Excel..." />}

      <Tooltip
        content="Generar Reporte Facturas"
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
