import  { useState, useEffect, useRef, useMemo } from 'react';
import {  Box, Text } from '@chakra-ui/react'; // Thay thế bằng thư viện và components thực tế của bạn
import { Tooltip } from 'react-tooltip';
import { ITask } from 'models/task';

interface TextToolTipProps  {
    item?: ITask,
    title?: string,
    maxLines: number,
    type: 'BOARD' | 'LIST',
    width?: number
}


const TextToolTip = ({ item, title, maxLines = 2, type, width  }:TextToolTipProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(type === "LIST");
  const textRef = useRef<HTMLParagraphElement | null>(null);



  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const lineHeight = parseFloat(window.getComputedStyle(textRef.current).lineHeight);

        const currentLines = Math.ceil(textRef.current.scrollHeight / lineHeight);

        if (currentLines > maxLines) {
            textRef.current.style.maxHeight = `${maxLines * lineHeight}px`;
            textRef.current.style.overflowY = 'hidden';
        }

        setIsTooltipVisible(currentLines > maxLines);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [
    maxLines
  ]);

  const isList:boolean = useMemo(() => {
    if(type === "LIST") return true
    return false
  }, [type])

  const resultTitle:string = useMemo(() => {
    if(!title && !item?.title) return 'no title';
    if(isList){
        return title || item?.title || 'no title';
    }

    return item?.title || title || 'no title'

  }, [title, item, isList]);




  return (
      <Box style={width ? { width: width }: { flex: 1 }} >
          <Text
            ref={textRef}
            fontWeight={'normal'}
            data-tooltip-id={resultTitle}
            mr={1}
            style={isList ? {overflow: "hidden" ,whiteSpace: 'nowrap', textOverflow: "ellipsis", display: "block", width: width || "100%" } : {
                overflow: "hidden",
                fontWeight: 600
            }}
            css={{
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
            }}
          >
            {resultTitle}
          </Text>
          {(isTooltipVisible ||isList) && (
            <Tooltip
              id={resultTitle}
              place="bottom"
              content={resultTitle}
            />
          )}

      </Box>
  );
};

export default TextToolTip;
