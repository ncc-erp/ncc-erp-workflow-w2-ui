import {
  Box,
  Icon,
  keyframes,
  Table as TableComponent,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ColumnDef,
  OnChangeFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ColorThemeMode } from 'common/constants';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import theme from 'themes/theme';
import TableSkeleton from './TableSkeleton';
import styles from './style.module.scss';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export type IRowActionProps<D> = (data: D) => () => void;

interface TableProps<D> {
  columns: ColumnDef<D, unknown>[];
  manualSorting?: boolean;
  data: D[];
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  onRowClick?: IRowActionProps<D>;
  onRowHover?: boolean;
  isHighlight?: boolean;
  isLoading?: boolean;
  isRefetching?: boolean;
  pageSize?: number;
  dataTestId?: string;
}

const DEFAULT_SKELETON_AMOUNT = 5;

export const Table = <D,>({
  columns,
  data,
  sorting,
  onSortingChange,
  onRowClick,
  onRowHover,
  isHighlight,
  isLoading,
  isRefetching,
  pageSize,
  dataTestId,
}: TableProps<D>) => {
  const table = useReactTable({
    data,
    columns,
    manualSorting: true,
    debugTable: true,
    defaultColumn: {
      size: 0,
      minSize: 0,
    },
    enableSortingRemoval: false,
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const borderColor = useColorModeValue(
    theme.colors.borderLight,
    theme.colors.borderDark
  );
  const itemTableHover = useColorModeValue(
    theme.colors.hoverTableItemLight,
    theme.colors.hoverTableItemDark
  );
  const itemTableColor = useColorModeValue(
    theme.colors.colorTableItemLight,
    theme.colors.colorTableItemDark
  );
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [columnHovered, setColumnHovered] = useState<Array<boolean>>([]);
  const handleMouseEnter = (index: number) => {
    const newColumnHovered = [...columnHovered];
    newColumnHovered[index] = true;
    setColumnHovered(newColumnHovered);
  };

  const handleMouseLeave = (index: number) => {
    const newColumnHovered = [...columnHovered];
    newColumnHovered[index] = false;
    setColumnHovered(newColumnHovered);
  };

  return (
    <TableContainer
      sx={{
        '&::-webkit-scrollbar': {
          width: '0',
          marginTop: '4px',
          height: '6px',
        },
      }}
      className={styles.tableContainer}
      border={`1px solid ${borderColor}`}
    >
      <TableComponent border={`1px solid ${borderColor}`}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id} bg={borderColor}>
              {headerGroup.headers.map((header, index) => {
                const DEFAULT_COLUMN_LOADING_WIDTH = '35%';

                const getThWidth = () => {
                  const columnCustomSize = header.getSize();
                  return isLoading
                    ? columnCustomSize > 0
                      ? columnCustomSize
                      : DEFAULT_COLUMN_LOADING_WIDTH
                    : columnCustomSize > 0
                    ? columnCustomSize
                    : 'auto';
                };

                return (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    textTransform="none"
                    fontWeight={600}
                    fontSize={{
                      base: '12px',
                      sm: '14px',
                      lg: 'sm',
                      xl: 'sm',
                    }}
                    height={['40px', '48px']}
                    borderTop={`1px solid ${borderColor}`}
                    borderBottom={`1px solid ${borderColor}`}
                    color={color}
                    px={['8px', '12px']}
                    background={
                      color === 'light'
                        ? theme.colors.TableHeaderLight
                        : theme.colors.TableHeaderDark
                    }
                    textAlign="center"
                    style={{
                      width: getThWidth(),
                    }}
                    whiteSpace={['normal', 'normal', 'normal', 'nowrap']}
                    cursor={header.column.getCanSort() ? 'pointer' : 'initial'}
                  >
                    {header.isPlaceholder ? null : (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap={['2px', '12px']}
                        onClick={header.column.getToggleSortingHandler()}
                        cursor={
                          header.column.getCanSort() ? 'pointer' : 'initial'
                        }
                        onMouseEnter={() =>
                          header.column.getCanSort() &&
                          !header.column.getIsSorted()
                            ? handleMouseEnter(index)
                            : null
                        }
                        onMouseLeave={() =>
                          header.column.getCanSort() &&
                          !header.column.getIsSorted()
                            ? handleMouseLeave(index)
                            : null
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <Icon fontSize="md" as={IoMdArrowDropup} />,
                          desc: <Icon fontSize="md" as={IoMdArrowDropdown} />,
                        }[header.column.getIsSorted() as string] ?? null}
                        {header.column.getCanSort() &&
                        !header.column.getIsSorted() ? (
                          isLargeScreen ? (
                            columnHovered[index] ? (
                              <Icon fontSize="md" as={IoMdArrowDropup} />
                            ) : (
                              <span style={{ width: '16px' }} />
                            )
                          ) : sorting ? (
                            <Icon fontSize="md" as={IoMdArrowDropup} />
                          ) : (
                            <span style={{ width: '16px' }} />
                          )
                        ) : (
                          ''
                        )}
                      </Box>
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {isLoading || isRefetching ? (
            <>
              {Array.from({ length: pageSize ?? DEFAULT_SKELETON_AMOUNT }).map(
                (_, rowIndex) => (
                  <Tr key={rowIndex} height="65px">
                    {table.getAllColumns().map((_column, colIndex) => (
                      <Td
                        key={colIndex}
                        fontSize={['12px', '12px', '12px', '14px']}
                        borderColor={borderColor}
                        px={['8px', '12px']}
                      >
                        <TableSkeleton />
                      </Td>
                    ))}
                  </Tr>
                )
              )}
            </>
          ) : (
            table.getRowModel().rows.map((row) => {
              return (
                <Tr
                  key={row.id}
                  cursor={onRowHover ? 'pointer' : 'initial'}
                  color={itemTableColor}
                  _hover={
                    isHighlight
                      ? {
                          background: itemTableHover,
                          transition: 'background-color 0.5s ease',
                        }
                      : {}
                  }
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row.original)();
                    }
                  }}
                  animation={`${fadeIn} 1s cubic-bezier(0.390, 0.575, 0.565, 1.000)`}
                  data-testid={dataTestId}
                  /* eslint-disable @typescript-eslint/no-explicit-any */
                  data-id={(row.original as any).id}
                  data-instance-id={(row.original as any).workflowInstanceId}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        fontSize={['12px', '12px', '12px', '14px']}
                        borderColor={borderColor}
                        height={'72px'}
                        fontWeight="medium"
                        px={['8px', '12px']}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })
          )}
        </Tbody>
      </TableComponent>
    </TableContainer>
  );
};
