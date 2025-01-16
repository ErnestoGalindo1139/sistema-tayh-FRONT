import React, { useState } from 'react';
import { useTheme } from '../../ThemeContext';
import { Tooltip } from 'flowbite-react';

interface DataTableProps<T> {
  data: T[];
  columns: { id: keyof T; texto: string; visible: boolean }[];
  actions?: {
    texto: string;
    icono: React.JSX.Element;
    onClick: (row: T) => void;
  }[];
  initialRowsPerPage?: number; // Número inicial de filas por página
}

export const DataTable = <T,>({
  data,
  columns,
  actions,
  initialRowsPerPage = 5, // Valor inicial por defecto
}: DataTableProps<T>): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { isDarkMode } = useTheme();

  // Verificar si data es un array válido
  if (!Array.isArray(data)) {
    return <div className="dark:text-white">No se encontraron datos.</div>; // O puedes lanzar un error o manejarlo de otra manera
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
    <div className={`overflow-x-auto ${isDarkMode ? 'dark' : ''}`}>
      <div className="overflow-y-auto max-h-[400px]">
        {' '}
        {/* Altura fija para el scroll */}
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-1">
            <tr>
              {columns
                .filter((column) => column.visible)
                .map((column) => (
                  <th
                    key={String(column.id)}
                    className="p-4 border-b border-gray-300 text-center cursor-pointer text-[1.6rem]"
                    onClick={() => handleSort(column.id)}
                  >
                    {column.texto}
                    {sortColumn === column.id &&
                      (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                ))}
              {actions && (
                <th className="p-4 border-b border-gray-300 text-center text-[1.6rem]">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center p-4 text-[1.6rem]"
                >
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns
                    .filter((column) => column.visible)
                    .map((column) => {
                      const cellValue: unknown = row[column.id];

                      if (column.id === 'sn_Activo') {
                        return (
                          <td
                            key={String(column.id)}
                            className=" border-b border-gray-300 text-center"
                          >
                            <span
                              className={`inline-block w-[80%] py-1 rounded-[0.3rem] text-white font-bold text-[1.5rem] ${
                                cellValue ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            >
                              {cellValue ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        );
                      }

                      if (String(column.id).startsWith('im_')) {
                        return (
                          <td
                            key={String(column.id)}
                            className="p-2 border-b border-gray-300 dark:text-white text-[1.6rem]"
                          >
                            {typeof cellValue === 'string'
                              ? `$${cellValue}`
                              : 'N/A'}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={String(column.id)}
                          className="p-2 border-b border-gray-300 dark:text-white text-[1.6rem]"
                        >
                          {typeof cellValue === 'string' ||
                          typeof cellValue === 'number'
                            ? cellValue
                            : 'N/A'}
                        </td>
                      );
                    })}
                  {actions && (
                    <td className="p-2 border-b border-gray-300 text-center">
                      <div className="flex items-center justify-center gap-[4px]">
                        {actions.map((action, actionIndex) => (
                          <Tooltip
                            content={action.texto}
                            key={actionIndex}
                            className="text-[1.2rem]"
                            placement="bottom"
                          >
                            <button
                              onClick={() => action.onClick(row)}
                              className="text-[1.6rem]"
                            >
                              {action.icono}
                            </button>
                          </Tooltip>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
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
              className="border border-gray-300 rounded-md w-[6.4rem] text-[1.6rem]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
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
              className="px-2 py-1 rounded-md disabled:opacity-50 text-[1.6rem]   text-white bg-[#22c5ea]"
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
