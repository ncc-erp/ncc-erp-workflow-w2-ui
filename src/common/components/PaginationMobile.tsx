import { Box, ButtonProps, Flex, IconButton } from '@chakra-ui/react';
import { PaginationProps as PaginationComponentProps } from 'rc-pagination';
import { useCallback, useMemo } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PaginationProps extends PaginationComponentProps {
  itemRenderProps?: ButtonProps;
}

export const PaginationMobile = ({
  current,
  onChange,
  ...paginationProps
}: PaginationProps) => {
  const isLastPage = (activePage: number) => {
    return (
      Math.ceil(
        (paginationProps.total as number) / (paginationProps.pageSize as number)
      ) === activePage
    );
  };
  const totalPage = useMemo(() => {
    return Math.ceil(
      (paginationProps.total as number) / (paginationProps.pageSize as number)
    );
  }, [paginationProps.total, paginationProps.pageSize]);

  const onChangeNext = useCallback(() => {
    if (current === totalPage) return;
    onChange?.(
      ((current as number) || 1) + 1,
      paginationProps.pageSize as number
    );
  }, [onChange, current, paginationProps.pageSize, totalPage]);

  const onChangePrev = useCallback(() => {
    if (current === 1) return;
    onChange?.(
      ((current as number) || 1) - 1,
      paginationProps.pageSize as number
    );
  }, [onChange, current, paginationProps.pageSize]);

  return (
    <Flex
      width={'100%'}
      justifyContent={'space-between'}
      alignItems={'center'}
      pt={4}
    >
      <IconButton
        rounded="lg"
        variant="outline"
        _active={{
          backgroundColor: 'stone.50',
        }}
        _disabled={{
          color: 'disabledPage',
        }}
        isDisabled={current === 1}
        onClick={onChangePrev}
        aria-label="prev"
        color="paginationText"
      >
        <FaArrowLeft />
      </IconButton>
      <Box fontWeight="normal" fontSize="xs" color="paginationText">
        Page{' '}
        <span
          style={{
            fontWeight: 500,
          }}
        >
          {current}
        </span>{' '}
        of{' '}
        <span
          style={{
            fontWeight: 500,
          }}
        >
          {totalPage}
        </span>
      </Box>
      <IconButton
        rounded="lg"
        variant="outline"
        isDisabled={isLastPage(current as number)}
        _active={{
          backgroundColor: 'stone.50',
        }}
        _disabled={{
          color: 'disabledPage',
        }}
        onClick={onChangeNext}
        aria-label="next"
        color="paginationText"
      >
        <FaArrowRight />
      </IconButton>
    </Flex>
  );
};
