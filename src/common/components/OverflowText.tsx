import { Tooltip } from '@chakra-ui/react';
import { CSSProperties, useEffect, useRef, useState } from 'react';

interface IProp {
  text: string;
  maxLines: number;
  styles?: CSSProperties;
  isShowTooltip?: boolean;
}

export default function OverflowText({
  maxLines,
  text,
  styles,
  isShowTooltip,
}: IProp) {
  const ref = useRef(null);
  const [isOverflown, setIsOverflown] = useState(false);
  useEffect(() => {
    const element = ref.current! as HTMLElement;
    setIsOverflown(element.scrollWidth > element.clientWidth);
  }, []);
  return (
    <Tooltip label={text} isDisabled={!isOverflown || !isShowTooltip}>
      <div
        ref={ref}
        style={{
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'block',
          ...styles,
        }}
      >
        {text}
      </div>
    </Tooltip>
  );
}
