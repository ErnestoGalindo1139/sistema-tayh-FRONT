import Swal from 'sweetalert2';

// Definir la interfaz para las opciones del Toast
interface ToastOptions {
  title: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'; // Tipos de icono
  position?:
    | 'top-start'
    | 'top-end'
    | 'top'
    | 'center'
    | 'bottom-start'
    | 'bottom-end'
    | 'bottom'; // Tipos de posición
}

class ToastComponent {
  // Método para mostrar el Toast
  static fire(options: ToastOptions): void {
    const { title, text, icon, position } = options;

    const toast = Swal.mixin({
      toast: true,
      position: position || 'top-end', // Valor por defecto
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    toast.fire({
      icon: icon || 'success',
      title: title || 'Operación Exitosa',
      text: text,
    });
  }
}

// Exportar el componente
export const Toast = ToastComponent;
export default Toast;
