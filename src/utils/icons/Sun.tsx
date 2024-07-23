import { SVGAttributes } from 'react';

type Props = SVGAttributes<SVGElement> & {
  color?: string;
};

function SunIcon({ color = '#667085', ...props }: Props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_651_2578)">
        <path
          d="M8.00016 1.33337V2.66671M8.00016 13.3334V14.6667M2.66683 8.00004H1.3335M4.20957 4.20945L3.26676 3.26664M11.7908 4.20945L12.7336 3.26664M4.20957 11.7934L3.26676 12.7362M11.7908 11.7934L12.7336 12.7362M14.6668 8.00004H13.3335M11.3335 8.00004C11.3335 9.84099 9.84111 11.3334 8.00016 11.3334C6.15921 11.3334 4.66683 9.84099 4.66683 8.00004C4.66683 6.15909 6.15921 4.66671 8.00016 4.66671C9.84111 4.66671 11.3335 6.15909 11.3335 8.00004Z"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_651_2578">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SunIcon;
