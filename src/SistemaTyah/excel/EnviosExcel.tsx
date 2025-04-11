import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Toast from '../components/Toast';
import { IApiError } from '../interfaces/interfacesApi';
import { WaitScreen } from '../components/WaitScreen';
import { Tooltip } from 'flowbite-react';
import { ExcelIcon } from '../icons/ExcelIcon';
import { IEstatus } from '../interfaces/interfacesEstatus';
import { IEnvios, IFiltrosEnvios } from '../interfaces/interfacesEnvios';
import { getEnviosExcel } from '../helpers/apiEnvios';

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
    title: 'Folio Envio',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 100 },
  },
  {
    title: 'Nombre Cliente',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 200 },
  },
  {
    title: 'Direccion',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 270 },
  },
  {
    title: 'Correo Electronico',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 270 },
  },
  {
    title: 'Telefono Celular',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 200 },
  },
  {
    title: 'Telefono Red Local',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 200 },
  },
  {
    title: 'Folio Guia',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Estatus',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
  {
    title: 'Fecha Registro',
    style: { ...style.title, ...style.borderLBR },
    width: { wpx: 140 },
  },
];

interface IEnviosExcelProps {
  filtros: IFiltrosEnvios;
}

export const EnviosExcel = ({
  filtros,
}: IEnviosExcelProps): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  // Llamada a la API para traer la información
  const fetchEnvios = async (): Promise<IEnvios[]> => {
    try {
      setIsLoading(true);

      const clientes = Array.isArray(filtros.id_Cliente)
        ? filtros.id_Cliente
            .map((cliente: { value: unknown }) => cliente.value)
            .toString()
        : '';

      filtros.clientes = clientes;

      const enviosData = await getEnviosExcel(filtros);
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
    const dataApi = await fetchEnvios();
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
      tl: { col: 1, row: 1.3 }, // Esquina superior izquierda
      ext: { width: 300, height: 70 }, // Tamaño en píxeles
    });

    const clientes = Array.isArray(filtros.id_Cliente)
      ? filtros.id_Cliente
          .map((cliente: { label: unknown }) => cliente.label)
          .toString()
      : '';

    filtros.clientes = clientes;

    // Definir los filtros como objetos
    const filtrosData = [
      {
        nb_Filtro1: 'Folio Envio:',
        de_Filtro1: filtros.id_Envio || 'Todos',
        nb_Filtro2: 'Clientes:',
        de_Filtro2: filtros.clientes || 'Todos',
      },
      {
        nb_Filtro1: 'Direccion:',
        de_Filtro1: filtros.de_Direccion || 'Todas',
        nb_Filtro2: 'Teléfono de Red Local:',
        de_Filtro2: filtros.nu_TelefonoRedLocal || 'Todos',
      },
      {
        nb_Filtro1: 'Teléfono Celular:',
        de_Filtro1: filtros.nu_TelefonoCelular || 'Todos',
        nb_Filtro2: 'Correo Electronico:',
        de_Filtro2: filtros.de_CorreoElectronico || 'Todos',
      },
      {
        nb_Filtro1: 'Estatus:',
        de_Filtro1: filtros.id_Estatus || 'Todos',
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
        item.id_Envio,
        item.nb_Cliente,
        item.de_Direccion || '',
        item.de_CorreoElectronico || '',
        item.nu_TelefonoCelular || '',
        item.nu_TelefonoRedLocal || '',
        item.de_FolioGuia || '',
        item.id_Estatus,
        item.fh_Registro || '',
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
    saveAs(blob, 'reporte_envios.xlsx');

    Toast.fire({ icon: 'success', title: 'Reporte generado exitosamente' });
  };

  return (
    <div>
      {isLoading && <WaitScreen message="Generando Excel..." />}

      <Tooltip
        content="Generar Reporte Envios"
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
