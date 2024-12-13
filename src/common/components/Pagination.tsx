import { Box, Button, ButtonProps } from '@chakra-ui/react';
import PaginationComponent, {
  PaginationProps as PaginationComponentProps,
} from 'rc-pagination';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { BsThreeDots } from 'react-icons/bs';

interface PaginationProps extends PaginationComponentProps {
  itemRenderProps?: ButtonProps;
}

type ItemRenderFn = (
  activePage?: number,
  props?: ButtonProps
) => PaginationComponentProps['itemRender'];

export const Pagination = ({
  itemRenderProps,
  current,
  ...paginationProps
}: PaginationProps) => {
  const isLargeScreen = useMediaQuery('(min-width: 1281px)');

  const isLastPage = (activePage: number) => {
    return (
      Math.ceil(
        (paginationProps.total as number) / (paginationProps.pageSize as number)
      ) === activePage
    );
  };

  const ItemRender: ItemRenderFn =
    (activePage, buttonProps) => (current, type) => {
      switch (type) {
        case 'jump-next':
          return (
            <Button
              rounded={isLargeScreen ? 'sm' : 'xs'}
              variant="outline"
              size={isLargeScreen ? 'sm' : 'xs'}
              aspectRatio="1/1"
              borderRadius="0px"
              borderLeft="0px"
              _active={{
                backgroundColor: '#F2F4F7',
              }}
              {...buttonProps}
            >
              <BsThreeDots />
            </Button>
          );
        case 'jump-prev':
          return (
            <Button
              rounded={isLargeScreen ? 'sm' : 'xs'}
              variant="outline"
              size={isLargeScreen ? 'sm' : 'xs'}
              aspectRatio="1/1"
              borderRadius="0px"
              borderLeft="0px"
              _active={{
                backgroundColor: '#F2F4F7',
              }}
              {...buttonProps}
            >
              <BsThreeDots />
            </Button>
          );
        case 'prev':
          return (
            <Button
              rounded={isLargeScreen ? 'sm' : 'xs'}
              variant="outline"
              size={isLargeScreen ? 'sm' : 'xs'}
              {...buttonProps}
              _active={{
                backgroundColor: '#F2F4F7',
              }}
              isDisabled={activePage === 1}
              leftIcon={<FaArrowLeft />}
              borderLeftRadius="8px"
            >
              Previous
            </Button>
          );
        case 'next':
          return (
            <Button
              rounded={isLargeScreen ? 'sm' : 'xs'}
              variant="outline"
              size={isLargeScreen ? 'sm' : 'xs'}
              {...buttonProps}
              isDisabled={isLastPage(activePage as number)}
              _active={{
                backgroundColor: '#F2F4F7',
              }}
              rightIcon={<FaArrowRight />}
              borderRightRadius="8px"
              borderLeft="0px"
            >
              Next
            </Button>
          );
        default:
          return (
            <Button
              rounded={isLargeScreen ? 'sm' : 'xs'}
              variant={activePage === current ? 'solid' : 'outline'}
              background={activePage === current ? '#F2F4F7' : undefined}
              size={isLargeScreen ? 'sm' : 'xs'}
              borderRadius="0px"
              _active={{
                backgroundColor: '#F2F4F7',
              }}
              {...buttonProps}
              borderLeft="0px"
            >
              {current}
            </Button>
          );
      }
    };
  return (
    <Box
      display="flex"
      listStyleType="none"
      shadow={'xs'}
      borderRadius="8px"
      current={current}
      as={PaginationComponent}
      itemRender={ItemRender(current, itemRenderProps)}
      {...paginationProps}
      showLessItems={isLargeScreen ? false : true}
    />
  );
};
