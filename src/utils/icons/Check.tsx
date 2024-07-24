import { SVGAttributes } from 'react';

type Props = SVGAttributes<SVGElement> & {
  color?: string;
};

function CheckIcon({ color = '#17B26A', ...props }: Props) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 3L4.5 8.5L2 6"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default CheckIcon;
