import { SVGAttributes } from 'react';

type Props = SVGAttributes<SVGElement> & {
  color?: string;
};

function PlusIcon({ color = '#FFFAEB', ...props }: Props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.99984 4.16669V15.8334M4.1665 10H15.8332"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default PlusIcon;
