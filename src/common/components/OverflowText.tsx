import { CSSProperties } from 'react';

interface Iprop {
  text: string;
  maxLines: number;
  styles?: CSSProperties | undefined;
}

export default function OverflowText({ maxLines, text, styles }: Iprop) {
  return (
    <div
      style={{
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        ...styles,
      }}
    >
      {text}
    </div>
  );
}
