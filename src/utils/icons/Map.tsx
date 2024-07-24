import { SVGAttributes } from 'react';

type Props = SVGAttributes<SVGElement> & {
  color?: string;
};

function MapIcon({ color = '#667085', ...props }: Props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.00016 12L1.3335 14.6667V4.00004L6.00016 1.33337M6.00016 12L10.6668 14.6667M6.00016 12V1.33337M10.6668 14.6667L14.6668 12V1.33337L10.6668 4.00004M10.6668 14.6667V4.00004M10.6668 4.00004L6.00016 1.33337"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default MapIcon;
