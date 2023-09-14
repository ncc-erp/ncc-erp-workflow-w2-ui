import {
  ColumnDef,
  OnChangeFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Box,
  Icon,
  Table as TableComponent,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

interface TableProps<D> {
  columns: ColumnDef<D, unknown>[];
  manualSorting?: boolean;
  data: D[];
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export const Table = <D,>({
  columns,
  data,
  sorting,
  onSortingChange,
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

  return (
    <TableComponent borderTop="1px" borderColor="gray.200">
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <Th
                  key={header.id}
                  colSpan={header.colSpan}
                  textTransform="none"
                  fontWeight={600}
                  fontSize="sm"
                  borderRight="1px"
                  borderColor="gray.200"
                  color="blackAlpha.900"
                  px="8px"
                  background="secondaryColor"
                  textAlign="center"
                >
                  {header.isPlaceholder ? null : (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap="12px"
                      onClick={header.column.getToggleSortingHandler()}
                      cursor={
                        header.column.getCanSort() ? 'pointer' : 'initial'
                      }
                    >
                      {{
                        asc: <Icon fontSize="md" as={IoMdArrowDropup} />,
                        desc: <Icon fontSize="md" as={IoMdArrowDropdown} />,
                      }[header.column.getIsSorted() as string] ?? null}
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <Td
                    key={cell.id}
                    fontSize="14px"
                    borderRight="1px"
                    borderColor="gray.200"
                    px="8px"
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
