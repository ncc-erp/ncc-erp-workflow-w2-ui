import { Box, Button, ButtonProps, Flex } from '@chakra-ui/react';
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
      <Button
        rounded={'xs'}
        variant="outline"
        _active={{
          backgroundColor: '#F2F4F7',
        }}
        borderRadius={'8px'}
        height={'40px'}
        isDisabled={current === 1}
        onClick={onChangePrev}
      >
        <FaArrowLeft />
      </Button>
      <Box
        style={{
          fontWeight: 400,
          fontSize: '12px',
        }}
      >
        Page{' '}
        <span
          style={{
            fontWeight: 500,
          }}
          color="#344054"
        >
          {current}
        </span>{' '}
        of{' '}
        <span
          style={{
            fontWeight: 500,
          }}
          color="#344054"
        >
          {totalPage}
        </span>
      </Box>
      <Button
        rounded={'xs'}
        variant="outline"
        isDisabled={isLastPage(current as number)}
        borderRadius={'8px'}
        height={'40px'}
        _active={{
          backgroundColor: '#F2F4F7',
        }}
        onClick={onChangeNext}
      >
        <FaArrowRight />
      </Button>
    </Flex>
  );
};
