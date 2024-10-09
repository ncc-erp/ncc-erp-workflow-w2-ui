import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { PlacesType, Tooltip } from 'react-tooltip';

interface TextToolTipProps {
  title?: string;
  maxLines: number;
  type: 'BOARD' | 'LIST';
  width?: number;
  place?: PlacesType | undefined;
  id?: string;
}

const TextToolTip = ({
  id,
  title,
  maxLines = 2,
  type,
  width,
  place = 'bottom',
  ...props
}: TextToolTipProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(
    type === 'LIST'
  );
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const isList = type === 'LIST';

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        if (
          textRef.current.offsetHeight < textRef.current.scrollHeight ||
          textRef.current.offsetWidth < textRef.current.scrollWidth
        ) {
          setIsTooltipVisible(true);
        } else {
          setIsTooltipVisible(false);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [maxLines]);

  const resultTitle: string = useMemo(() => {
    if (id && title) {
      return title;
    }
    if (id && !title) {
      return `${id}`;
    }
    if (!id) {
      return title ? title : '';
    }
    return '';
  }, [id, title]);

  return (
    <Box
      style={
        width ? { width: width } : { flex: 1, display: 'flex', width: '100%' }
      }
      {...props}
    >
      <Text
        ref={textRef}
        fontWeight={'normal'}
        data-tooltip-id={resultTitle}
        mr={1}
        style={
          isList
            ? {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 600,
                display: 'inline-block',
                WebkitBoxOrient: 'vertical',
                flex: 1,
                width: 0,
                whiteSpace: 'nowrap',
                margin: 0,
              }
            : {
                overflow: 'hidden',
                fontWeight: 600,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
              }
        }
        css={{
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {resultTitle}
      </Text>
      {isTooltipVisible && (
        <Tooltip
          style={{ width: 300 }}
          id={resultTitle}
          place={place}
          content={title}
        />
      )}
    </Box>
  );
};

export default TextToolTip;
