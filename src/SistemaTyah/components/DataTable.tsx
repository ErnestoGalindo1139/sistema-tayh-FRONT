import React, { useState } from 'react';
import { Tooltip, Table } from 'flowbite-react';
import { useTheme } from '../../ThemeContext';

interface DataTableProps<T> {
  data: T[];
  columns: { id: keyof T; texto: string; visible: boolean; width: string }[];
  actions?: {
    texto: string;
    icono: React.JSX.Element;
    onClick: (row: T) => void;
    width?: string;
  }[];
  initialRowsPerPage?: number;
}

export const DataTable = <T,>({
  data,
  columns,
  actions,
  initialRowsPerPage = 10,
}: DataTableProps<T>): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { isDarkMode } = useTheme();

  // Verificar si data es un array válido
  if (!Array.isArray(data)) {
    return (
      <div className="dark:text-white text-[2rem]">
        No se encontraron datos.
      </div>
    ); // O puedes lanzar un error o manejarlo de otra manera
  }
  // Calcular el número total de páginas
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Obtener los datos de la página actual
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // Obtener los datos de la página actual (cambiar 'data' por 'sortedData')

  // Manejar el clic en la cabecera para ordenar
  const handleSort = (column: keyof T): void => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Ordenar los datos según la columna y dirección
  const sortedData = [...data].sort((a, b) => {
    if (a[sortColumn!] < b[sortColumn!]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortColumn!] > b[sortColumn!]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const currentData = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  // Funciones para cambiar de página
  const goToNextPage = (): void => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = (): void => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToFirstPage = (): void => {
    setCurrentPage(1);
  };

  const goToLastPage = (): void => {
    setCurrentPage(totalPages);
  };

  // Manejar cambio en el select de filas por página
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Resetear a la primera página al cambiar el número de filas
  };

  return (
    <div className={`overflow-x-auto ${isDarkMode ? 'dark' : ''} p-4`}>
      <Table hoverable>
        <Table.Head>
          {columns
            .filter((column) => column.visible)
            .map((column) => (
              <Table.HeadCell
                key={String(column.id)}
                className="cursor-pointer lg:text-[1.2rem] text-center lg:p-[1.8rem] bg-gray-200 p-[1rem]  text-[1rem] capitalize"
                onClick={() => handleSort(column.id)}
                style={{ width: column.width || 'auto' }} // Asignar el width aquí
              >
                {column.texto}
                {sortColumn === column.id &&
                  (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </Table.HeadCell>
            ))}
          {actions && (
            <Table.HeadCell
              className="lg:text-[1.2rem] text-center lg:p-[1.8rem] bg-gray-200 p-[1rem]  text-[1rem] capitalize"
              style={{ width: actions[0].width || 'auto' }}
            >
              Acciones
            </Table.HeadCell>
          )}
        </Table.Head>
        <Table.Body className="divide-y">
          {currentData.length === 0 ? (
            <Table.Row>
              <Table.Cell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center text-gray-500 py-4 text-[1.5rem]"
              >
                No se encontraron registros.
              </Table.Cell>
            </Table.Row>
          ) : (
            currentData.map((row, rowIndex) => (
              <Table.Row
                key={rowIndex}
                className={`hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`} // Alterna entre colores
              >
                {columns
                  .filter((column) => column.visible)
                  .map((column) => {
                    const cellValue = row[column.id];
                    const displayValue = String(row[column.id] ?? 'N/A'); // Convertirlo siempre a string

                    if (column.id === 'sn_Activo') {
                      return (
                        <Table.Cell
                          key={String(column.id)}
                          className="border-b border-gray-300 text-center text-[1.5rem] p-0"
                          style={{ width: column.width || 'auto' }} // Asignar el width aquí
                        >
                          <span
                            className={`inline-block w-[80%] py-[0.7rem] rounded-[0.3rem] text-white font-bold ${
                              cellValue ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          >
                            {cellValue ? 'Activo' : 'Inactivo'}
                          </span>
                        </Table.Cell>
                      );
                    }
                    return (
                      <Table.Cell
                        key={String(column.id)}
                        className="py-3 px-6 text-[1.5rem] text-gray-600 leading-[2rem]"
                        style={{ width: column.width || 'auto' }} // Asignar el width aquí
                      >
                        <Tooltip
                          content={displayValue}
                          placement="bottom"
                          className="text-[1.2rem] leading-[2rem]"
                        >
                          <span className="leading-[2rem]">{displayValue}</span>
                        </Tooltip>
                      </Table.Cell>
                    );
                  })}
                {actions && (
                  <Table.Cell
                    className="py-3 px-6 text-[1.5rem]"
                    style={{ width: actions[0].width || 'auto' }}
                  >
                    <div className="flex justify-center gap-2">
                      {actions.map((action, actionIndex) => (
                        <Tooltip
                          key={actionIndex}
                          content={action.texto}
                          placement="bottom"
                          className="w-auto text-center text-[1.5rem] leading-[2rem]"
                        >
                          <button
                            onClick={() => action.onClick(row)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                          >
                            {action.icono}
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                  </Table.Cell>
                )}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
        {/* Información de los registros mostrados */}
        <div className="text-left font-bold dark:text-white text-[1.6rem]">
          Mostrando {currentData.length} de {data.length} registros
        </div>

        {/* Controles de paginación */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de tamaño de página */}
          <div className="flex items-center">
            <label
              htmlFor="rowsPerPage"
              className="mr-2 dark:text-white text-[1.6rem]"
            >
              Tamaño de Página:
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-gray-300 rounded-md w-[8rem] text-[1.6rem]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={1000}>1000</option>
            </select>
          </div>

          {/* Botones de control de paginación */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md disabled:opacity-50 text-[1.6rem] text-white bg-[#22c5ea] w-[3rem]"
            >
              ⏮
            </button>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md disabled:opacity-50 text-[1.6rem] text-white bg-[#22c5ea] rotate-180"
            >
              ➜
            </button>
            <div className="dark:text-white text-[1.6rem]">
              Página {currentPage} de {totalPages}
            </div>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md disabled:opacity-50 text-[1.6rem] text-white bg-[#22c5ea]"
            >
              ➜
            </button>
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md disabled:opacity-50 text-[1.6rem] text-white bg-[#22c5ea] w-[3rem]"
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
