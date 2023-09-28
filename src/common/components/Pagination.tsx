import { Box, Button, ButtonProps, useColorModeValue } from '@chakra-ui/react';
import PaginationComponent, {
  PaginationProps as PaginationComponentProps,
} from 'rc-pagination';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { ColorThemeMode } from 'common/constants';

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
  const bg = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const color = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);

  const ItemRender: ItemRenderFn =
    (activePage, buttonProps) => (current, type) => {
      switch (type) {
        case 'jump-next':
          return (
            <Button
              rounded="sm"
              variant="outline"
              borderRadius="8px"
              size="sm"
              aspectRatio="1/1"
              {...buttonProps}
            >
              <FaAngleDoubleRight />
            </Button>
          );
        case 'jump-prev':
          return (
            <Button
              rounded="sm"
              variant="outline"
              borderRadius="8px"
              size="sm"
              aspectRatio="1/1"
              {...buttonProps}
            >
              <FaAngleDoubleLeft />
            </Button>
          );
        case 'prev':
          return (
            <Button
              rounded="sm"
              variant="outline"
              borderRadius="8px"
              size="sm"
              aspectRatio="1/1"
              {...buttonProps}
            >
              <FaChevronLeft />
            </Button>
          );
        case 'next':
          return (
            <Button
              rounded="sm"
              variant="outline"
              borderRadius="8px"
              size="sm"
              aspectRatio="1/1"
              {...buttonProps}
            >
              <FaChevronRight />
            </Button>
          );
        default:
          return (
            <Button
              rounded="sm"
              variant={activePage === current ? 'solid' : 'outline'}
              background={activePage === current ? bg : undefined}
              color={activePage === current ? color : undefined}
              size="sm"
              borderRadius="8px"
              {...buttonProps}
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
      gap="12px"
      current={current}
      as={PaginationComponent}
      itemRender={ItemRender(current, itemRenderProps)}
      {...paginationProps}
    />
  );
};
