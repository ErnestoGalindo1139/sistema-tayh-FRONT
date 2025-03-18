// Extiende el tipo de CustomFlowbiteTheme para permitir propiedades adicionales si es necesario
export interface CustomTheme {
  base?: string;
  layout?: {
    table?: {
      base?: string;
      span?: string;
    };
  };
  pages?: {
    base?: string;
    showIcon?: string;
    previous?: {
      base?: string;
      icon?: string;
    };
    next?: {
      base?: string;
      icon?: string;
    };
    selector?: {
      base?: string;
      active?: string;
      disabled?: string;
    };
  };
}

export const customPaginationTheme: CustomTheme = {
  base: '',
  layout: {
    table: {
      base: 'text-sm text-gray-700 dark:text-gray-400',
      span: 'font-semibold text-gray-900 dark:text-white',
    },
  },
  pages: {
    base: 'xs:mt-0 mt-2 inline-flex items-center -space-x-px',
    showIcon: 'inline-flex',
    previous: {
      base: 'ml-0 rounded-l-lg border border-gray-300 bg-white px-6 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white text-[2rem]',
      icon: 'h-[3rem] w-[2rem]',
    },
    next: {
      base: 'rounded-r-lg border border-gray-300 bg-white px-6 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white text-[2rem]',
      icon: 'h-[3rem] w-[2rem]',
    },
    selector: {
      base: 'w-[5rem] border border-gray-300 bg-white py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white text-[2rem]',
      active:
        'bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white',
      disabled: 'cursor-not-allowed opacity-50',
    },
  },
};
