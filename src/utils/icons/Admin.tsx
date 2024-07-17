import { SVGAttributes } from 'react';

type Props = SVGAttributes<SVGElement> & {
  color?: string;
};

function AdminIcon({ color = 'white', ...props }: Props) {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.93027 16.1987C5.4372 15.0044 6.62079 14.1667 8.00002 14.1667H13C14.3793 14.1667 15.5628 15.0044 16.0698 16.1987M13.8334 7.91669C13.8334 9.75764 12.341 11.25 10.5 11.25C8.65907 11.25 7.16669 9.75764 7.16669 7.91669C7.16669 6.07574 8.65907 4.58335 10.5 4.58335C12.341 4.58335 13.8334 6.07574 13.8334 7.91669ZM18.8334 10C18.8334 14.6024 15.1024 18.3334 10.5 18.3334C5.89765 18.3334 2.16669 14.6024 2.16669 10C2.16669 5.39765 5.89765 1.66669 10.5 1.66669C15.1024 1.66669 18.8334 5.39765 18.8334 10Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default AdminIcon;
