import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Box,
  Center,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Spinner,
} from '@chakra-ui/react';
import { Table } from 'common/components/Table/Table';
import { SortDirection, UserSortField } from 'common/enums';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from 'common/components/Pagination';
import { noOfRows } from 'common/constants';
import { PageSize } from 'common/components/Table/PageSize';
import { ShowingItemText } from 'common/components/Table/ShowingItemText';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { FilterUserParams, UserIdentity } from 'models/userIdentity';
import { useUserIdentity } from 'api/apiHooks/userIdentityHooks';
import { RowAction } from './RowAction';
import { UserModal } from './UserModal';
import useDebounced from 'hooks/useDebounced';
import { TbSearch } from 'react-icons/tb';

const initialFilter: FilterUserParams = {
  filter: '',
  maxResultCount: +noOfRows[0].value,
  skipCount: 0,
  sorting: [UserSortField.userName, 'asc'].join(' '),
};

const initialSorting: SortingState = [
  {
    id: UserSortField.userName,
    desc: false,
  },
];

export const UserManagementTable = () => {
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const [filterUser, setFilterUser] = useState<FilterUserParams>(initialFilter);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const { data, isLoading } = useUserIdentity(filterUser);
  const { items: requests = [], totalCount = 0 } = data ?? {};
  const columnHelper = createColumnHelper<UserIdentity>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [user, setUser] = useState<UserIdentity>();
  const [txtSearch, setTxtSearch] = useState('');
  const txtSearchDebounced = useDebounced(txtSearch, 500);

  const userColumns = useMemo(
    () =>
      [
        columnHelper.accessor('userName', {
          id: 'userName',
          header: () => <Box>User name</Box>,
          enableSorting: true,
          sortDescFirst: true,
          cell: (info) => <Box>{info.getValue()}</Box>,
        }),
        columnHelper.accessor('email', {
          id: 'email',
          header: 'Email address',
          enableSorting: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('phoneNumber', {
          id: 'phoneNumber',
          header: 'Phone number',
          enableSorting: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.display({
          id: 'actions',
          enableSorting: false,
          header: () => <Center w="full">Actions</Center>,
          cell: (info) => (
            <Center>
              <RowAction
                onEdit={onAction(info.row.original, 'Edit')}
                onPermissions={onAction(info.row.original, 'Permissions')}
                onDelete={onAction(info.row.original, 'Delete')}
              />
            </Center>
          ),
        }),
      ] as ColumnDef<UserIdentity>[],
    [columnHelper]
  );

  const currentPage = useMemo(() => {
    const { skipCount, maxResultCount } = filterUser;
    return (maxResultCount + skipCount) / maxResultCount;
  }, [filterUser]);

  useEffect(() => {
    const { id, desc } = sorting?.[0] ?? {};
    const sort = `${id} ${desc ? SortDirection.desc : SortDirection.asc}`;

    setFilterUser((filter) => ({
      ...filter,
      sorting: sort,
      skipCount: 0,
    }));
  }, [sorting]);

  useEffect(() => {
    setFilterUser((filterUser) => ({
      ...filterUser,
      filter: txtSearchDebounced,
    }));
  }, [txtSearchDebounced]);

  const onPageChange = (page: number) => {
    setFilterUser((filter) => ({
      ...filter,
      skipCount: filter.maxResultCount * (page - 1),
    }));
  };

  const onPageSizeChange = (pageSize: number) => {
    setFilterUser((filterUser) => ({
      ...filterUser,
      maxResultCount: pageSize,
      skipCount: 0,
    }));
  };

  const onAction =
    (user: UserIdentity, type: 'Edit' | 'Permissions' | 'Delete') => () => {
      setUser(user);
      setIsModalOpen(true);
      setModalTitle(type);
    };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Box>
        <HStack
          w="full"
          p="0px 24px 20px 0px"
          justifyContent="space-between"
          display="flex"
        >
          <HStack w="full" pl="24px" alignItems="flex-end" flexWrap="wrap">
            <InputGroup w={'20%'}>
              <Input
                type="text"
                placeholder="Enter email"
                fontSize="14px"
                mb={2}
                value={txtSearch}
                onChange={(e) => setTxtSearch(e.target.value)}
              />
              <InputRightElement width="40px">
                <TbSearch />
              </InputRightElement>
            </InputGroup>
          </HStack>
        </HStack>
        {isLoading ? (
          <Center h="200px">
            <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
          </Center>
        ) : (
          <EmptyWrapper
            isEmpty={!requests.length}
            h="200px"
            fontSize="xs"
            message={'No request found!'}
          >
            <Box
              p="20px 24px"
              overflowX="auto"
              w={{ base: `calc(100vw - ${sideBarWidth}px)`, lg: 'auto' }}
            >
              <Table
                columns={userColumns}
                data={requests}
                sorting={sorting}
                onSortingChange={setSorting}
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
            <PageSize noOfRows={noOfRows} onChange={onPageSizeChange} />
            <Spacer w="12px" />
            <ShowingItemText
              skipCount={filterUser.skipCount}
              maxResultCount={filterUser.maxResultCount}
              totalCount={totalCount}
            />
          </HStack>
          <Pagination
            total={totalCount}
            pageSize={filterUser.maxResultCount}
            current={currentPage}
            onChange={onPageChange}
            hideOnSinglePage
          />
        </HStack>
        {user && (
          <UserModal
            isOpen={isModalOpen}
            onClose={onCloseModal}
            user={user}
            modalTitle={modalTitle}
          />
        )}
      </Box>
    </>
  );
};
