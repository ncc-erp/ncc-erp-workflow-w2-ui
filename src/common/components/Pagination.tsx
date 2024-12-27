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
              variant="outline"
              aspectRatio="1/1"
              borderRadius="0px"
              borderLeft="0px"
              bg="paginationBtnBg"
              color="paginationText"
              _active={{
                backgroundColor: 'paginationBtnActiveBg',
              }}
              borderColor="border"
              {...buttonProps}
            >
              <i>
                <BsThreeDots size="14px" />
              </i>
            </Button>
          );
        case 'jump-prev':
          return (
            <Button
              variant="outline"
              aspectRatio="1/1"
              borderRadius="0px"
              borderLeft="0px"
              bg="paginationBtnBg"
              color="paginationText"
              _active={{
                backgroundColor: 'paginationBtnActiveBg',
              }}
              borderColor="border"
              {...buttonProps}
            >
              <i>
                <BsThreeDots size="14px" />
              </i>
            </Button>
          );
        case 'prev':
          return (
            <Button
              variant="outline"
              fontSize="sm"
              bg="paginationBtnBg"
              color="paginationText"
              {...buttonProps}
              _active={{
                backgroundColor: 'paginationBtnActiveBg',
              }}
              _disabled={{
                color: 'disabledPage',
              }}
              isDisabled={activePage === 1}
              leftIcon={<FaArrowLeft />}
              borderLeftRadius="8px"
              borderRightRadius="0"
              borderColor="border"
            >
              Previous
            </Button>
          );
        case 'next':
          return (
            <Button
              variant="outline"
              fontSize="sm"
              bg="paginationBtnBg"
              color="paginationText"
              {...buttonProps}
              isDisabled={isLastPage(activePage as number)}
              _active={{
                backgroundColor: 'paginationBtnActiveBg',
              }}
              _disabled={{
                color: 'disabledPage',
              }}
              rightIcon={<FaArrowRight />}
              borderLeftRadius="0"
              borderRightRadius="8px"
              borderLeft="0px"
              borderColor="border"
            >
              Next
            </Button>
          );
        default:
          return (
            <Button
              variant="outline"
              background={
                activePage === current
                  ? 'paginationBtnActiveBg'
                  : 'paginationBtnBg'
              }
              borderRadius="0px"
              color="paginationText"
              _active={{
                backgroundColor: 'paginationBtnActiveBg',
              }}
              fontSize="sm"
              {...buttonProps}
              borderLeft="0px"
              borderColor="border"
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
      current={current}
      as={PaginationComponent}
      itemRender={ItemRender(current, itemRenderProps)}
      {...paginationProps}
      showLessItems={isLargeScreen ? false : true}
      showTitle={false}
    />
  );
};
