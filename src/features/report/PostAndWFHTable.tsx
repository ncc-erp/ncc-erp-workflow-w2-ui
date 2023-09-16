import {
  Box,
  Center,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
  Spacer,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { noOfRows } from 'common/constants';
import { FilterWfhParams, IPostAndWFH } from 'models/report';
import { appConfigState } from 'stores/appConfig';
import { Table } from 'common/components/Table/Table';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from 'common/components/Pagination';
import { PageSize } from 'common/components/Table/PageSize';
import { ShowingItemText } from 'common/components/Table/ShowingItemText';
import { SortDirection, WfhSortField } from 'common/enums';
import { useWfhList } from 'api/apiHooks/reportHooks';
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { TbSearch } from 'react-icons/tb';
import useDebounced from 'hooks/useDebounced';

const initialFilter: FilterWfhParams = {
  maxResultCount: +noOfRows[0].value,
  skipCount: 0,
  sorting: [WfhSortField.email, 'desc'].join(' '),
  keySearch: '',
};

const initialSorting: SortingState = [
  {
    id: WfhSortField.email,
    desc: false,
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

  const getPercentPostWFH = (numOfPosts: number, numOfRequestWFH: number) => {
    return (numOfPosts / numOfRequestWFH) * 100;
  };

  const wfhColumns = useMemo(
    () =>
      [
        columnHelper.accessor('userRequestName', {
          id: 'userRequestName',
          header: () => <Box pl="16px">Email address</Box>,
          enableSorting: true,
          sortDescFirst: true,
          cell: (info) => <Box pl="16px">{info.getValue()}</Box>,
        }),
        columnHelper.accessor('totalposts', {
          id: 'totalposts',
          header: 'Number of posts',
          enableSorting: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('totaldays', {
          id: 'totaldays',
          header: 'Number of requests for WFH',
          enableSorting: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.display({
          id: 'status',
          enableSorting: false,
          header: () => <Box pr="16px">Status</Box>,
          cell: (info) => {
            const percent = getPercentPostWFH(
              info.row.original.totalposts,
              info.row.original.totaldays
            );
            return (
              <Stack minW={200} pr="16px">
                <Progress
                  w={'100%'}
                  colorScheme={percent >= 100 ? 'green' : 'blue'}
                  size="sm"
                  value={percent}
                />
              </Stack>
            );
          },
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

  return (
    <>
      <Box>
        <HStack
          w="full"
          pl="24px"
          pb="3px"
          alignItems="flex-end"
          flexWrap="wrap"
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
        </HStack>
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
                data={wfhList}
                onSortingChange={setSorting}
                sorting={sorting}
              />
            </Box>
          </EmptyWrapper>
        )}
        <HStack
          p="0px 30px 20px 30px"
          justifyContent="space-between"
          borderBottom="1px"
          borderColor="gray.200"
          flexWrap="wrap"
        >
          <HStack alignItems="center" spacing="6px" flexWrap="wrap">
            <PageSize noOfRows={noOfRows} onChange={onPageSizeChange} />
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
      </Box>
    </>
  );
};
