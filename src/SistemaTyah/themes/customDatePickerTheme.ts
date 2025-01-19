import type { CustomFlowbiteTheme } from 'flowbite-react';

// Extiende el tipo de CustomFlowbiteTheme para permitir propiedades adicionales si es necesario
interface CustomTheme extends CustomFlowbiteTheme {
  root?: {
    base?: string;
  };
  popup?: {
    root?: {
      base?: string;
      inline?: string;
      inner?: string;
    };
    header?: {
      base?: string;
      title?: string;
      selectors?: {
        base?: string;
        button?: {
          base?: string;
          prev?: string;
          next?: string;
          view?: string;
        };
      };
    };
    view?: {
      base?: string;
    };
    footer?: {
      base?: string;
      button?: {
        base?: string;
        today?: string;
        clear?: string;
      };
    };
  };
  views?: {
    days?: {
      header?: {
        base?: string;
        title?: string;
      };
      items?: {
        base?: string;
        item?: {
          base?: string;
          selected?: string;
          disabled?: string;
        };
      };
    };
    months?: {
      items?: {
        base?: string;
        item?: {
          base?: string;
          selected?: string;
          disabled?: string;
        };
      };
    };
    years?: {
      items?: {
        base?: string;
        item?: {
          base?: string;
          selected?: string;
          disabled?: string;
        };
      };
    };
    decades?: {
      items?: {
        base?: string;
        item?: {
          base?: string;
          selected?: string;
          disabled?: string;
        };
      };
    };
  };
}

export const customDatePickerTheme: CustomTheme = {
  root: {
    base: 'relative',
  },
  popup: {
    root: {
      base: 'absolute top-10 z-50 block pt-2',
      inline: 'relative top-0 z-auto',
      inner:
        'inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700 w-[30rem]',
    },
    header: {
      base: '',
      title:
        'px-2 py-3 text-center font-semibold text-gray-900 dark:text-white',
      selectors: {
        base: 'mb-2 flex justify-between',
        button: {
          base: 'rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-[1.7rem]',
          prev: '',
          next: '',
          view: '',
        },
      },
    },
    view: {
      base: 'p-1',
    },
    footer: {
      base: 'mt-2 flex space-x-1 mt-[2rem]',
      button: {
        base: 'w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-cyan-300 text-[1.4rem]',
        today:
          'bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700',
        clear:
          'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
      },
    },
  },
  views: {
    days: {
      header: {
        base: 'mb-1 grid grid-cols-7 ',
        title:
          'h-6 text-center font-medium leading-6 text-gray-500 dark:text-gray-400 text-[1.5rem]',
      },
      items: {
        base: 'grid grid-cols-7 pt-[.7rem] gap-y-[.5rem]',
        item: {
          base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 text-[1.7rem]',
          selected: 'bg-cyan-700 text-white hover:bg-cyan-600',
          disabled: 'text-gray-500',
        },
      },
    },
    months: {
      items: {
        base: 'grid grid-cols-4 pt-[.7rem] gap-y-[2rem] mb-[1rem]',
        item: {
          base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 text-[1.7rem]',
          selected: 'bg-cyan-700 text-white hover:bg-cyan-600',
          disabled: 'text-gray-500',
        },
      },
    },
    years: {
      items: {
        base: 'grid grid-cols-4 pt-[.7rem] gap-y-[2rem] mb-[1rem]',
        item: {
          base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 text-[1.7rem]',
          selected: 'bg-cyan-700 text-white hover:bg-cyan-600',
          disabled: 'text-gray-500',
        },
      },
    },
    decades: {
      items: {
        base: 'grid w-64 grid-cols-4',
        item: {
          base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600',
          selected: 'bg-cyan-700 text-white hover:bg-cyan-600',
          disabled: 'text-gray-500',
        },
      },
    },
  },
};
