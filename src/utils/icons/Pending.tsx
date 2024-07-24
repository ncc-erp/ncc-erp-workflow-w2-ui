import { SVGAttributes } from 'react';

type Props = SVGAttributes<SVGElement> & {
  color?: string;
};

function PendingIcon({ color = '#F79009', ...props }: Props) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_481_1249)">
        <path
          d="M1 5C1 5 1.06066 4.57538 2.81802 2.81802C4.57538 1.06066 7.42462 1.06066 9.18198 2.81802C9.80462 3.44066 10.2067 4.20036 10.3881 5M1 5V2M1 5H4M11 7C11 7 10.9393 7.42462 9.18198 9.18198C7.42462 10.9393 4.57538 10.9393 2.81802 9.18198C2.19538 8.55934 1.79335 7.79964 1.61191 7M11 7V10M11 7H8"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_481_1249">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default PendingIcon;
