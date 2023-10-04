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
  useColorModeValue,
} from '@chakra-ui/react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { ColorThemeMode } from 'common/constants';
import theme from 'themes/theme';
import { ITask, Request } from 'models/request';
import { IPostAndWFH } from 'models/report';

export type IRowActionProps = (
  data: Request | string | IPostAndWFH
) => () => void;

export enum ActionType {
  ViewDetails = 'viewDetails',
  OpenTaskDetailModal = 'openTaskDetailModal',
  OpenWfhReportModal = 'openWfhReportModal',
}

interface TableProps<D> {
  columns: ColumnDef<D, unknown>[];
  manualSorting?: boolean;
  data: D[];
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  actionType?: ActionType;
  onActionClick?: IRowActionProps;
}

export const Table = <D,>({
  columns,
  data,
  sorting,
  onSortingChange,
  onActionClick,
  actionType,
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

  return (
    <TableComponent border={`1px solid ${theme.colors.borderColor}`}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id} bg={theme.colors.borderColor}>
            {headerGroup.headers.map((header) => {
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
            <Tr
              key={row.id}
              onClick={() => {
                if (onActionClick && actionType) {
                  switch (actionType) {
                    case ActionType.ViewDetails:
                      onActionClick(row.original as Request)();
                      break;
                    case ActionType.OpenTaskDetailModal:
                      onActionClick((row.original as ITask).id)();
                      break;
                    case ActionType.OpenWfhReportModal:
                      onActionClick(row.original as IPostAndWFH)();
                      break;
                  }
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
