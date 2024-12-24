import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useWfhList } from 'api/apiHooks/reportHooks';
import { Pagination } from 'common/components/Pagination';
import { PageSize } from 'common/components/Table/PageSize';
import { Table } from 'common/components/Table/Table';
import {
  FilterAll,
  TaskStatus,
  WFHFilterDate,
  noOfRows,
} from 'common/constants';
import { ETaskStatus, SortDirection, WfhSortField } from 'common/enums';
import { FilterWfhParams, IPostAndWFH } from 'models/report';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import DateRangePicker from 'common/components/DateRangePicker';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import useDebounced from 'hooks/useDebounced';
import ReactDatePicker from 'react-datepicker';
import { FaDownload } from 'react-icons/fa';
import { TbSearch } from 'react-icons/tb';
import { formatDate } from 'utils';
import { handleExportExcelFile } from 'utils/handleExportExcelFile';
import styles from './styles.module.scss';
import { AiOutlineReload } from 'react-icons/ai';
import { SelectField } from 'common/components/SelectField';
import { TFilterTask } from 'common/types';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { PaginationMobile } from 'common/components/PaginationMobile';

const initialFilter: FilterWfhParams = {
  maxResultCount: +noOfRows[0].value,
  skipCount: 0,
  sorting: [WfhSortField.creationTime, 'desc'].join(' '),
  keySearch: '',
  status: TaskStatus.Approved,
  startDate: formatDate(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    'yyyy-MM-dd'
  ),
  endDate: formatDate(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    'yyyy-MM-dd'
  ),
};

const initialSorting: SortingState = [
  {
    id: WfhSortField.creationTime,
    desc: true,
  },
];

export const TablePostAndWFH = () => {
  const [filter, setFilter] = useState<FilterWfhParams>(initialFilter);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const columnHelper = createColumnHelper<IPostAndWFH>();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const { data, isLoading, isRefetching, refetch } = useWfhList(filter);
  const { items: wfhList = [] } = data ?? {};
  const [txtSearch, setTxtSearch] = useState('');
  const txtSearchDebounced = useDebounced(txtSearch, 500);
  const [startDate, setStartDate] = useState<Date | null>(
    initialFilter.startDate ? new Date(initialFilter.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialFilter.endDate ? new Date(initialFilter.endDate) : null
  );
  const endDatePicker = useRef<ReactDatePicker | null>(null);

  const wfhColumns = useMemo(
    () =>
      [
        columnHelper.accessor('email', {
          id: 'email',
          enableSorting: true,
          sortDescFirst: true,
          minSize: 300,
          header: () => <Box>Email address</Box>,
          cell: (info) => <Box>{info.getValue()}</Box>,
        }),
        columnHelper.accessor('reason', {
          id: 'reason',
          enableSorting: false,
          sortDescFirst: true,
          maxSize: 500,
          header: () => <Box>Reason</Box>,
          cell: (info) => (
            <Box
              sx={{
                wordWrap: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {info.getValue() ?? '-'}
            </Box>
          ),
        }),
        columnHelper.accessor('status', {
          id: 'status',
          header: 'Status',
          size: 50,
          enableSorting: false,
          cell: (info) => {
            const status =
              info.getValue() === ETaskStatus.Approved
                ? 'Approved'
                : info.getValue() === ETaskStatus.Rejected
                ? 'Rejected'
                : 'Pending';
            return (
              <Box>
                <div className={`${styles.badge} ${styles[status]}`}>
                  {status}
                </div>
              </Box>
            );
          },
        }),
        columnHelper.accessor('remoteDate', {
          id: 'remoteDate',
          header: 'Remote Date',
          size: 80,
          cell: (info) => {
            const remoteDate = info.getValue().toString() ?? '';
            return (
              <Box>
                {remoteDate
                  ? `${remoteDate?.substring(0, 4)}-${remoteDate?.substring(
                      4,
                      6
                    )}-${remoteDate?.substring(6)}`
                  : '-'}
              </Box>
            );
          },
          sortDescFirst: false,
        }),
        columnHelper.accessor('creationTime', {
          id: 'creationTime',
          header: 'Created At',
          size: 150,
          cell: (info) => (
            <Box>{info.getValue() ? formatDate(info.getValue()!) : '-'}</Box>
          ),
          sortDescFirst: false,
        }),
      ] as ColumnDef<IPostAndWFH>[],
    [columnHelper]
  );

  const currentPage = useMemo(() => {
    const { skipCount, maxResultCount } = filter;
    return (maxResultCount + skipCount) / maxResultCount;
  }, [filter]);

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    if (!date) {
      setEndDate(null);
    } else {
      if (endDatePicker.current) {
        endDatePicker.current.setFocus();
      }
      if (endDate && date >= endDate) {
        setEndDate(null);
      }
    }
  };

  const handleEndDateChange = (date: Date) => {
    if (date && startDate && date >= startDate) {
      setEndDate(date);
    }
  };

  const onPageChange = (page: number) => {
    setFilter((filter) => ({
      ...filter,
      skipCount: filter.maxResultCount * (page - 1),
    }));
  };

  const onPageSizeChange = (pageSize: number) => {
    setFilter((filter) => ({
      ...filter,
      maxResultCount: pageSize,
      skipCount: 0,
    }));
  };

  const statusOptions = useMemo(() => {
    const defaultOptions = {
      value: -1,
      label: FilterAll.STATUS,
    };

    const options = Object.entries(TaskStatus).map(([key, value]) => ({
      value,
      label: key,
    }));

    return [defaultOptions, ...options];
  }, []);

  const onTemplateStatusChange = useCallback(
    (key: TFilterTask, value?: string) => {
      switch (key) {
        case 'status':
          setFilter((filter) => ({
            ...filter,
            status: value ? +value : -1,
            skipCount: 0,
          }));
          break;

        case 'dates':
          {
            const today = new Date();
            let start: Date | null = null;
            let end: Date | null = null;

            switch (value) {
              case WFHFilterDate.CM:
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
              case WFHFilterDate.M2:
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                break;
              case WFHFilterDate.M3:
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today.getFullYear(), today.getMonth() + 3, 0);
                break;
            }

            setStartDate(start);
            setEndDate(end);
            setFilter((filter) => ({
              ...filter,
              startDate: start ? formatDate(start, 'yyyy-MM-dd') : null,
              endDate: end ? formatDate(end, 'yyyy-MM-dd') : null,
              dates: value,
              skipCount: 0,
            }));
          }
          break;
      }
    },
    []
  );

  const setDateRangeByStartDateAndEndDate = useCallback(
    (startDateInput: Date, endDateInput: Date) => {
      const today = new Date();
      const startDateInputFormatted = formatDate(startDateInput, 'yyyy-MM-dd');
      const endDateInputFormatted = formatDate(endDateInput, 'yyyy-MM-dd');
      let startFormatted = formatDate(
        new Date(today.getFullYear(), today.getMonth(), 1),
        'yyyy-MM-dd'
      );
      let endFormatted = formatDate(
        new Date(today.getFullYear(), today.getMonth() + 1, 0),
        'yyyy-MM-dd'
      );

      if (
        startDateInputFormatted == startFormatted &&
        endDateInputFormatted == endFormatted
      ) {
        setFilter((filter) => ({
          ...filter,
          dates: WFHFilterDate.CM,
        }));
      } else {
        startFormatted = formatDate(
          new Date(today.getFullYear(), today.getMonth(), 1),
          'yyyy-MM-dd'
        );
        endFormatted = formatDate(
          new Date(today.getFullYear(), today.getMonth() + 2, 0),
          'yyyy-MM-dd'
        );
        if (
          startDateInputFormatted == startFormatted &&
          endDateInputFormatted == endFormatted
        ) {
          setFilter((filter) => ({
            ...filter,
            dates: WFHFilterDate.M2,
          }));
        } else {
          startFormatted = formatDate(
            new Date(today.getFullYear(), today.getMonth(), 1),
            'yyyy-MM-dd'
          );
          endFormatted = formatDate(
            new Date(today.getFullYear(), today.getMonth() + 3, 0),
            'yyyy-MM-dd'
          );
          if (
            startDateInputFormatted == startFormatted &&
            endDateInputFormatted == endFormatted
          ) {
            setFilter((filter) => ({
              ...filter,
              dates: WFHFilterDate.M3,
            }));
          } else {
            setFilter((filter) => ({
              ...filter,
              dates: FilterAll.DATE,
            }));
          }
        }
      }
    },
    []
  );

  const dateOptions = useMemo(() => {
    const defaultOptions = {
      value: '',
      label: FilterAll.DATE,
    };

    const options = Object.values(WFHFilterDate).map((value) => ({
      value: value,
      label: value,
    }));

    return [defaultOptions, ...options];
  }, []);

  useEffect(() => {
    setFilter((filter) => ({
      ...filter,
      keySearch: txtSearchDebounced,
    }));
  }, [txtSearchDebounced]);

  useEffect(() => {
    const { id, desc } = sorting?.[0] ?? {};
    const sort = `${id} ${desc ? SortDirection.desc : SortDirection.asc}`;

    setFilter((filter) => ({
      ...filter,
      sorting: sort,
      skipCount: 0,
    }));
  }, [sorting]);

  useEffect(() => {
    if (startDate && endDate && startDate !== endDate) {
      setFilter((filter) => ({
        ...filter,
        startDate: formatDate(startDate, 'yyyy-MM-dd'),
        endDate: formatDate(endDate, 'yyyy-MM-dd'),
      }));

      setDateRangeByStartDateAndEndDate(startDate, endDate);
    } else {
      setFilter((filter) => ({
        ...filter,
        startDate: null,
        endDate: null,
        dates: FilterAll.DATE,
      }));
    }
  }, [startDate, endDate, setDateRangeByStartDateAndEndDate]);

  const exportData = wfhList.map((item) => ({
    id: item.id,
    email: item.email,
    reason: item.reason,
    status: item.status,
    remoteDate: item.remoteDate,
    creationTime: item.creationTime,
  }));

  return (
    <>
      <Box width={'100%'}>
        <HStack w="100%" display="flex" gap={'1rem'}>
          <InputGroup alignItems={'center'} maxW={'200px'}>
            <Input
              type="text"
              placeholder="Enter email"
              fontSize="14px"
              onChange={(e) => setTxtSearch(e.target.value)}
            />
            <InputRightElement width="40px">
              <TbSearch />
            </InputRightElement>
          </InputGroup>
          <Box>
            <SelectField
              value={filter?.status as number}
              size="sm"
              rounded="md"
              cursor="pointer"
              onChange={(e) => onTemplateStatusChange('status', e.target.value)}
              options={statusOptions}
            />
          </Box>
          <Box>
            <SelectField
              value={filter.dates}
              size="sm"
              rounded="md"
              cursor="pointer"
              onChange={(e) => onTemplateStatusChange('dates', e.target.value)}
              options={dateOptions}
            />
          </Box>
          <Box>
            <DateRangePicker
              isDisabled={isLoading || isRefetching}
              startDate={startDate}
              endDate={endDate}
              handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange}
              endDatePicker={endDatePicker}
            />
          </Box>
          <Wrap ml={'auto'}>
            <WrapItem>
              <div className={styles.btnExport}>
                <Button
                  isDisabled={isLoading || isRefetching}
                  onClick={() =>
                    handleExportExcelFile({
                      exportData: exportData,
                      type: 'WFH',
                    })
                  }
                >
                  <FaDownload />
                </Button>
              </div>
            </WrapItem>
            <WrapItem>
              <IconButton
                isDisabled={isLoading || isRefetching}
                isRound={true}
                variant="solid"
                aria-label="Done"
                fontSize="20px"
                icon={<AiOutlineReload />}
                onClick={() => refetch()}
              />
            </WrapItem>
          </Wrap>
        </HStack>

        <EmptyWrapper
          isEmpty={!wfhList.length && !isLoading && !isRefetching}
          h="200px"
          fontSize="xs"
          message={'No request found!'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box p={{ base: '20px 0px' }} overflowX={'auto'} w={'100%'}>
            <Table
              columns={wfhColumns}
              data={wfhList}
              onSortingChange={setSorting}
              sorting={sorting}
              onRowHover={true}
              isLoading={isLoading || isRefetching}
            />
          </Box>
        </EmptyWrapper>

        {!isLoading && !isRefetching && (
          <Box>
            {isLargeScreen ? (
              <HStack
                py="20px"
                justifyContent={['center', 'space-between']}
                borderBottom="1px"
                borderColor="gray.200"
                flexWrap="wrap"
              >
                <HStack alignItems="center" spacing="6px" flexWrap="wrap">
                  <PageSize
                    noOfRows={noOfRows}
                    onChange={onPageSizeChange}
                    value={filter.maxResultCount}
                  />
                  <Spacer w="12px" />
                </HStack>
                <Pagination
                  total={data?.totalCount ?? 0}
                  pageSize={filter.maxResultCount}
                  current={currentPage}
                  onChange={onPageChange}
                  hideOnSinglePage
                  data-testid="pagination"
                />
              </HStack>
            ) : (
              <HStack
                display={'flex'}
                width={'100%'}
                p={['0px 16px 20px 16px', '0px 16px 20px 16px']}
                justifyContent={['center', 'space-between']}
              >
                <PaginationMobile
                  total={data?.totalCount ?? 0}
                  pageSize={filter.maxResultCount}
                  current={currentPage}
                  onChange={onPageChange}
                  hideOnSinglePage
                  data-testid="pagination"
                />
              </HStack>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};
