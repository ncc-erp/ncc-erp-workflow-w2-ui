import { SVGAttributes } from 'react';

type Props = SVGAttributes<SVGElement> & {
  color?: string;
};

function MoonIcon({ color = '#667085', ...props }: Props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_651_2793)">
        <path
          d="M14.6668 10.5629C13.7912 10.9588 12.8193 11.1793 11.7958 11.1793C7.94369 11.1793 4.82093 8.05651 4.82093 4.2044C4.82093 3.18094 5.04137 2.20897 5.43735 1.33337C3.01734 2.4278 1.3335 4.86317 1.3335 7.69183C1.3335 11.544 4.45625 14.6667 8.30837 14.6667C11.137 14.6667 13.5724 12.9829 14.6668 10.5629Z"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_651_2793">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default MoonIcon;
