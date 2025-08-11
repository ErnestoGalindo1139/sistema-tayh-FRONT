// utils/dateMx.ts
const DEFAULT_TZ = 'America/Mazatlan';

// Auxiliar: obtiene {year, month, day} en la zona horaria indicada
export const getPartesFechaZona = (
  date: Date,
  timeZone: string = DEFAULT_TZ
): { year: number; month: number; day: number } => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === 'year')!.value);
  const month = Number(parts.find((p) => p.type === 'month')!.value); // 1-12
  const day = Number(parts.find((p) => p.type === 'day')!.value); // 1-31

  return { year, month, day };
};

// Hoy en YYYY-MM-DD (hora local de Mazatlán)
export const getFechaActual = (timeZone: string = DEFAULT_TZ): string => {
  const { year, month, day } = getPartesFechaZona(new Date(), timeZone);
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

// Primer día del mes actual en YYYY-MM-DD (hora local de Mazatlán)
export const getInicioMesActual = (timeZone: string = DEFAULT_TZ): string => {
  const { year, month } = getPartesFechaZona(new Date(), timeZone);
  const mm = String(month).padStart(2, '0');
  return `${year}-${mm}-01`;
};

// Último día del mes actual en YYYY-MM-DD (hora local de Mazatlán)
export const getFinMesActual = (timeZone: string = DEFAULT_TZ): string => {
  const { year, month } = getPartesFechaZona(new Date(), timeZone);
  // Día 0 del mes siguiente => último día del mes actual
  const lastDay = new Date(year, month, 0).getDate(); // OJO: month aquí es 1-12
  const mm = String(month).padStart(2, '0');
  const dd = String(lastDay).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};
