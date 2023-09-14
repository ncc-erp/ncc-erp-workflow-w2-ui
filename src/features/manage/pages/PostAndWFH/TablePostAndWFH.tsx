import {
  Box,
  Input,
  Center,
  HStack,
  Spacer,
  Spinner,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { TbSearch } from 'react-icons/tb';
import { noOfRows } from 'common/constants';
import useDebounce from 'hooks/useDebounce';
import { postAndWTFColumns } from './helper';
import usePostAndWFH from 'hooks/usePostAndWFH';
import { IFilterReportWFH } from 'models/manage';
import { appConfigState } from 'stores/appConfig';
import { Table } from 'common/components/Table/Table';
import { useCallback, useMemo, useState } from 'react';
import { Pagination } from 'common/components/Pagination';
import { PageSize } from 'common/components/Table/PageSize';
import { ShowingItemText } from 'common/components/Table/ShowingItemText';

const initialFilter: IFilterReportWFH = {
  search: '',
  pages: 0,
  per_page: +noOfRows[0].value,
};

export const TablePostAndWFH = () => {
  // State
  const [filter, setFilter] = useState<IFilterReportWFH>(initialFilter);
  const [email, setEmail] = useState<string>('');

  // Hooks
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const { data, loading: isLoading, length } = usePostAndWFH(filter);

  const { pages, per_page } = filter;

  const currentPage = useMemo(
    () => (per_page + pages) / per_page,
    [pages, per_page]
  );

  const onPageChange = useCallback(
    (page: number) => {
      setFilter((filter) => ({
        ...filter,
        pages: filter.per_page * (page - 1),
      }));
    },
    [setFilter]
  );

  const onPageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter((filter) => ({
        ...filter,
        per_page: pageSize,
        pages: 0,
      }));
    },
    [setFilter]
  );

  useDebounce(
    () =>
      setFilter((filter) => ({
        ...filter,
        search: email,
      })),
    300,
    [email]
  );

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
              onChange={(e) => setEmail(e.target.value)}
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
          <Box
            p = "20px 30px 20px 30px"
            overflowX="auto"
            w={{ base: `calc(100vw - ${sideBarWidth}px)`, lg: 'auto' }}
          >
            <Table columns={postAndWTFColumns} data={data} />
          </Box>
        )}
        <HStack
          p = "0px 30px 20px 30px"
          justifyContent="space-between"
          borderBottom="1px"
          borderColor="gray.200"
          flexWrap="wrap"
        >
          <HStack alignItems="center" spacing="6px" flexWrap="wrap">
            <PageSize noOfRows={noOfRows} onChange={onPageSizeChange} />
            <Spacer w="12px" />
            <ShowingItemText
              skipCount={pages}
              maxResultCount={per_page}
              totalCount={length}
            />
          </HStack>
          <Pagination
            total={length}
            pageSize={per_page}
            current={currentPage}
            onChange={onPageChange}
            hideOnSinglePage
          />
        </HStack>
      </Box>
    </>
  );
};
