import {
  Box,
  Icon,
  keyframes,
  Table as TableComponent,
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
    <TableComponent border={`1px solid ${theme.colors.borderColor}`}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id} bg={theme.colors.borderColor}>
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
                    base: '10px',
                    sm: '12px',
                    lg: 'sm',
                    xl: 'sm',
                  }}
                  border={`1px solid ${theme.colors.borderColor}`}
                  color={color}
                  px={['2px', '8px']}
                  background="secondaryColor"
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
                      fontSize={['10px', '12px', '12px', '14px']}
                      borderRight="1px"
                      borderColor={theme.colors.borderColor}
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
                _hover={
                  isHighlight
                    ? {
                        background: theme.colors.secondary,
                        transition: 'background-color 0.5s ease',
                        color: '#333',
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
                      fontSize={['10px', '12px', '12px', '14px']}
                      borderRight="1px"
                      borderColor={theme.colors.borderColor}
                      px="6px"
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
  );
};
