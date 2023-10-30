import {
  Box,
  Icon,
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

export type IRowActionProps<D> = (data: D) => () => void;

interface TableProps<D> {
  columns: ColumnDef<D, unknown>[];
  manualSorting?: boolean;
  data: D[];
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  onRowClick?: IRowActionProps<D>;
  onRowHover?: boolean;
}

export const Table = <D,>({
  columns,
  data,
  sorting,
  onSortingChange,
  onRowClick,
  onRowHover,
}: TableProps<D>) => {
  const table = useReactTable({
    data,
    columns,
    manualSorting: true,
    debugTable: true,
    enableSortingRemoval: false,
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const isLargeScreen = useMediaQuery('(min-width: 768px)');

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
              const isWorkflowDefinitionDisplayName =
                header.id === 'workflowDefinitionDisplayName';
              const headerWidth = '20%';

              return (
                <Th
                  key={header.id}
                  colSpan={header.colSpan}
                  textTransform="none"
                  fontWeight={600}
                  fontSize="sm"
                  border={`1px solid ${theme.colors.borderColor}`}
                  color={color}
                  px="8px"
                  background="secondaryColor"
                  textAlign="center"
                  style={{ 
                    width:  isWorkflowDefinitionDisplayName ? headerWidth :  'auto', 
                  }}
                  whiteSpace={["normal","normal","normal","nowrap"]}
                  cursor={
                    header.column.getCanSort() ? 'pointer' : 'initial'
                  }
                >
                  {header.isPlaceholder ? null : (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      gap="12px"
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
                            <span style={{width:"16px"}} />
                          )
                        ) : sorting ? (
                          <Icon fontSize="md" as={IoMdArrowDropup} />
                        ) : (
                          <span style={{width:"16px"}} />
                        )
                      ) : (
                        ""
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
        {table.getRowModel().rows.map((row) => {
          return (
            <Tr
              key={row.id}
              cursor={onRowHover ? 'pointer' : 'initial'}
              onClick={() => {
                if (onRowClick) {
                  onRowClick(row.original)();
                }
              }}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <Td
                    key={cell.id}
                    fontSize="14px"
                    borderRight="1px"
                    borderColor={theme.colors.borderColor}
                    px="6px"
                    style={{
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </TableComponent>
  );
};
