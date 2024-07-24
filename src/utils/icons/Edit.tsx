import { SVGAttributes } from 'react';

type Props = SVGAttributes<SVGElement> & {
  color?: string;
};

function EditIcon({ color = '#FFFAEB', ...props }: Props) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.9999 8.33332L10.6666 4.99999M1.08325 17.9167L3.90356 17.6033C4.24813 17.565 4.42042 17.5459 4.58146 17.4937C4.72433 17.4475 4.86029 17.3821 4.98566 17.2995C5.12696 17.2063 5.24954 17.0837 5.49469 16.8386L16.4999 5.83332C17.4204 4.91285 17.4204 3.42046 16.4999 2.49999C15.5795 1.57951 14.0871 1.57951 13.1666 2.49999L2.16136 13.5052C1.91621 13.7504 1.79363 13.8729 1.70045 14.0142C1.61778 14.1396 1.55243 14.2756 1.50618 14.4185C1.45405 14.5795 1.43491 14.7518 1.39662 15.0964L1.08325 17.9167Z"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default EditIcon;
