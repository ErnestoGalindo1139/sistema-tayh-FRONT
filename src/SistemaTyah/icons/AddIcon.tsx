import React from 'react';
import type { SVGProps } from 'react';

export function AddIcon(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || '1.8em'}
      height={props.height || '1.8em'}
      viewBox="0 0 24 24"
      {...props} // Pasar otras props
    >
      <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
    </svg>
  );
}
