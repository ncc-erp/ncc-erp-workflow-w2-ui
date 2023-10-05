import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useWfhList } from 'api/apiHooks/reportHooks';
import { Pagination } from 'common/components/Pagination';
import { PageSize } from 'common/components/Table/PageSize';
import { ShowingItemText } from 'common/components/Table/ShowingItemText';
import { Table } from 'common/components/Table/Table';
import { noOfRows } from 'common/constants';
import { SortDirection, WfhSortField } from 'common/enums';
import { FilterWfhParams, IPostAndWFH } from 'models/report';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';

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
import { DetailModal } from './DetailModal';
import { RowAction } from './RowAction';
import styles from './styles.module.scss';

const initialFilter: FilterWfhParams = {
  maxResultCount: +noOfRows[2].value,
  skipCount: 0,
  sorting: [WfhSortField.totalMissingPosts, 'desc'].join(' '),
  keySearch: '',
  startDate: null,
  endDate: null,
};

const initialSorting: SortingState = [
  {
    id: WfhSortField.totalMissingPosts,
    desc: true,
  },
];

export const TablePostAndWFH = () => {
  const [filter, setFilter] = useState<FilterWfhParams>(initialFilter);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const columnHelper = createColumnHelper<IPostAndWFH>();
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const { data, isLoading } = useWfhList(filter);
  const { items: wfhList = [], totalCount = 0 } = data ?? {};
  const [txtSearch, setTxtSearch] = useState('');
  const txtSearchDebounced = useDebounced(txtSearch, 500);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const endDatePicker = useRef<ReactDatePicker | null>(null);
  const [isOpenModal, setOpenModal] = useState(false);
  const [reportDetail, setReportDetail] = useState<IPostAndWFH>();

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

  useEffect(() => {
    if (startDate && endDate && startDate !== endDate) {
      setFilter((filter) => ({
        ...filter,
        startDate: formatDate(startDate, 'MM/dd/yyyy'),
        endDate: formatDate(endDate, 'MM/dd/yyyy'),
      }));
    } else {
      setFilter((filter) => ({
        ...filter,
        startDate: null,
        endDate: null,
      }));
    }
  }, [startDate, endDate]);

  const onAction = (report: IPostAndWFH) => () => {
    setReportDetail(report);
    setOpenModal(true);
  };

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const wfhColumns = useMemo(
    () =>
      [
        columnHelper.accessor('email', {
          id: 'email',
          header: () => <Box>Email address</Box>,
          enableSorting: true,
          sortDescFirst: true,
          cell: (info) => <Box>{info.getValue()}</Box>,
        }),
        columnHelper.accessor('totalDays', {
          id: 'totalDays',
          header: 'Number of requests for WFH',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('totalPosts', {
          id: 'totalPosts',
          header: 'Number of posts',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('totalMissingPosts', {
          id: 'totalMissingPosts',
          header: 'Number of missing posts',
          cell: (info) => {
            const count = info.getValue();
            return (
              <Text
                color={count && count > 0 ? 'red' : ''}
                size="sm"
                fontWeight={count && count > 0 ? 'medium' : 'normal'}
              >
                {count}
              </Text>
            );
          },
        }),
        columnHelper.display({
          id: 'actions',
          enableSorting: false,
          header: () => <Center w="full">Actions</Center>,
          cell: (info) => (
            <Center onClick={(e) => e.stopPropagation()}>
              <RowAction onViewDetails={onAction(info.row.original)} />
            </Center>
          ),
        }),
      ] as ColumnDef<IPostAndWFH>[],
    [columnHelper]
  );

  const currentPage = useMemo(() => {
    const { skipCount, maxResultCount } = filter;
    return (maxResultCount + skipCount) / maxResultCount;
  }, [filter]);

  useEffect(() => {
    const { id, desc } = sorting?.[0] ?? {};
    const sort = `${id} ${desc ? SortDirection.desc : SortDirection.asc}`;

    setFilter((filter) => ({
      ...filter,
      sorting: sort,
      skipCount: 0,
    }));
  }, [sorting]);

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

  useEffect(() => {
    setFilter((filter) => ({
      ...filter,
      keySearch: txtSearchDebounced,
    }));
  }, [txtSearchDebounced]);

  const exportData = wfhList
    .filter((item) => item.totalMissingPosts !== 0)
    .map((item) => ({
      email: item.email,
      totalDays: item.totalDays,
      totalPosts: item.totalPosts,
      totalMissingPosts: item.totalMissingPosts,
    }));

  return (
    <>
      <Box>
        <HStack
          w="full"
          pl="24px"
          pr="24px"
          pb="3px"
          display="flex"
          justifyContent="space-between"
        >
          <InputGroup w={'20%'}>
            <Input
              type="text"
              placeholder="Enter email"
              fontSize="14px"
              mb={2}
              onChange={(e) => setTxtSearch(e.target.value)}
            />
            <InputRightElement width="40px">
              <TbSearch />
            </InputRightElement>
          </InputGroup>
          <Box>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange}
              endDatePicker={endDatePicker}
            />
          </Box>
        </HStack>
        <div className={styles.btnExport}>
          <Button
            onClick={() =>
              handleExportExcelFile({ exportData: exportData, type: 'WFH' })
            }
          >
            <FaDownload />
          </Button>
        </div>
        {isLoading ? (
          <Center h="200px">
            <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
          </Center>
        ) : (
          <EmptyWrapper
            isEmpty={!wfhList.length}
            h="200px"
            fontSize="xs"
            message={'No requests found!'}
          >
            <Box
              p="20px 30px 20px 30px"
              overflowX="auto"
              w={{ base: `calc(100vw - ${sideBarWidth}px)`, lg: 'auto' }}
            >
              <Table
                columns={wfhColumns}
                onRowClick={onAction}
                data={wfhList}
                onSortingChange={setSorting}
                sorting={sorting}
                onRowHover={true}
              />
            </Box>
          </EmptyWrapper>
        )}
        <HStack
          p="0px 30px 20px 30px"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <HStack alignItems="center" spacing="6px" flexWrap="wrap">
            <PageSize
              noOfRows={noOfRows}
              onChange={onPageSizeChange}
              defaultValue={+noOfRows[2].value}
            />
            <Spacer w="12px" />
            <ShowingItemText
              skipCount={filter.skipCount}
              maxResultCount={filter.maxResultCount}
              totalCount={totalCount}
            />
          </HStack>
          <Pagination
            total={totalCount}
            pageSize={filter.maxResultCount}
            current={currentPage}
            onChange={onPageChange}
            hideOnSinglePage
          />
        </HStack>
        {reportDetail && (
          <DetailModal
            isOpen={isOpenModal}
            onClose={onCloseModal}
            reportDetail={reportDetail}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </Box>
    </>
  );
};
