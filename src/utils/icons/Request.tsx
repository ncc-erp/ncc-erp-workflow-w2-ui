import { SVGAttributes } from 'react';

type Props = SVGAttributes<SVGElement> & {
  color?: string;
};

function RequestIcon({ color = 'white', ...props }: Props) {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.5 1.5H2.33333C1.86662 1.5 1.63327 1.5 1.45501 1.59083C1.29821 1.67072 1.17072 1.79821 1.09083 1.95501C1 2.13327 1 2.36662 1 2.83333V6C1 6.46671 1 6.70007 1.09083 6.87833C1.17072 7.03513 1.29821 7.16261 1.45501 7.24251C1.63327 7.33333 1.86662 7.33333 2.33333 7.33333H5.5C5.96671 7.33333 6.20007 7.33333 6.37833 7.24251C6.53513 7.16261 6.66261 7.03513 6.74251 6.87833C6.83333 6.70007 6.83333 6.46671 6.83333 6V2.83333C6.83333 2.36662 6.83333 2.13327 6.74251 1.95501C6.66261 1.79821 6.53513 1.67072 6.37833 1.59083C6.20007 1.5 5.96671 1.5 5.5 1.5Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.6667 1.5H11.5C11.0333 1.5 10.7999 1.5 10.6217 1.59083C10.4649 1.67072 10.3374 1.79821 10.2575 1.95501C10.1667 2.13327 10.1667 2.36662 10.1667 2.83333V6C10.1667 6.46671 10.1667 6.70007 10.2575 6.87833C10.3374 7.03513 10.4649 7.16261 10.6217 7.24251C10.7999 7.33333 11.0333 7.33333 11.5 7.33333H14.6667C15.1334 7.33333 15.3667 7.33333 15.545 7.24251C15.7018 7.16261 15.8293 7.03513 15.9092 6.87833C16 6.70007 16 6.46671 16 6V2.83333C16 2.36662 16 2.13327 15.9092 1.95501C15.8293 1.79821 15.7018 1.67072 15.545 1.59083C15.3667 1.5 15.1334 1.5 14.6667 1.5Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.6667 10.6667H11.5C11.0333 10.6667 10.7999 10.6667 10.6217 10.7575C10.4649 10.8374 10.3374 10.9649 10.2575 11.1217C10.1667 11.2999 10.1667 11.5333 10.1667 12V15.1667C10.1667 15.6334 10.1667 15.8667 10.2575 16.045C10.3374 16.2018 10.4649 16.3293 10.6217 16.4092C10.7999 16.5 11.0333 16.5 11.5 16.5H14.6667C15.1334 16.5 15.3667 16.5 15.545 16.4092C15.7018 16.3293 15.8293 16.2018 15.9092 16.045C16 15.8667 16 15.6334 16 15.1667V12C16 11.5333 16 11.2999 15.9092 11.1217C15.8293 10.9649 15.7018 10.8374 15.545 10.7575C15.3667 10.6667 15.1334 10.6667 14.6667 10.6667Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.5 10.6667H2.33333C1.86662 10.6667 1.63327 10.6667 1.45501 10.7575C1.29821 10.8374 1.17072 10.9649 1.09083 11.1217C1 11.2999 1 11.5333 1 12V15.1667C1 15.6334 1 15.8667 1.09083 16.045C1.17072 16.2018 1.29821 16.3293 1.45501 16.4092C1.63327 16.5 1.86662 16.5 2.33333 16.5H5.5C5.96671 16.5 6.20007 16.5 6.37833 16.4092C6.53513 16.3293 6.66261 16.2018 6.74251 16.045C6.83333 15.8667 6.83333 15.6334 6.83333 15.1667V12C6.83333 11.5333 6.83333 11.2999 6.74251 11.1217C6.66261 10.9649 6.53513 10.8374 6.37833 10.7575C6.20007 10.6667 5.96671 10.6667 5.5 10.6667Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default RequestIcon;
