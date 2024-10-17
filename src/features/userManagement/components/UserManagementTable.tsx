import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Badge,
  Box,
  Center,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
} from '@chakra-ui/react';
import { Table } from 'common/components/Table/Table';
import { SortDirection, UserSortField } from 'common/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pagination } from 'common/components/Pagination';
import { noOfRows } from 'common/constants';
import { PageSize } from 'common/components/Table/PageSize';
import { ShowingItemText } from 'common/components/Table/ShowingItemText';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { FilterUserParams, UserIdentity } from 'models/userIdentity';
import { useRoles, useUserIdentity } from 'api/apiHooks/userIdentityHooks';
import { RowAction } from './RowAction';
import { UserModal } from './UserModal';
import useDebounced from 'hooks/useDebounced';
import { TbSearch } from 'react-icons/tb';
import { convertToCase } from 'utils';
import { SelectField } from 'common/components/SelectField';
import { AiOutlineReload } from 'react-icons/ai';
import { UserRoleLabelMapping } from '../../../common/constants';

const initialFilter: FilterUserParams = {
  filter: '',
  maxResultCount: +noOfRows[0].value,
  skipCount: 0,
  sorting: [UserSortField.userName, 'asc'].join(' '),
  roles: '',
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
  const { data, isLoading, refetch, isRefetching } =
    useUserIdentity(filterUser);
  const { data: roles } = useRoles();
  const { items: requests = [], totalCount = 0 } = data ?? {};
  const columnHelper = createColumnHelper<UserIdentity>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [user, setUser] = useState<UserIdentity>();
  const [txtSearch, setTxtSearch] = useState('');
  const txtSearchDebounced = useDebounced(txtSearch, 500);

  const onUserListFilterChange = useCallback(
    (key: 'sorting' | 'roles' | 'filter', value?: string) => {
      setFilterUser((filterUser) => ({
        ...filterUser,
        [key]: value,
        skipCount: 0,
      }));
    },
    []
  );

  const userRolesOptions = useMemo(() => {
    if (!roles || !roles.items) return [];

    const filterRoles = roles.items.map((x) => {
      return {
        value: x.name,
        label: convertToCase(x.name),
      };
    });
    const result = Array.from(
      new Set(filterRoles.map((x) => JSON.stringify(x)))
    ).map((x) => JSON.parse(x));
    return [{ value: '', label: 'All Roles' }, ...result];
  }, [roles]);

  const userColumns = useMemo(
    () =>
      [
        columnHelper.accessor('userName', {
          id: 'userName',
          header: () => <Box>User name</Box>,
          enableSorting: true,
          sortDescFirst: true,
          cell: (info) => (
            <Box>
              {!info.row.original.isActive && (
                <Badge colorScheme="red">Disabled</Badge>
              )}{' '}
              {info.getValue()}
            </Box>
          ),
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
        columnHelper.accessor('roles', {
          id: 'roles',
          header: 'Roles',
          enableSorting: true,
          cell: (info) => {
            const roles = info.getValue();
            if (Array.isArray(roles) && roles.length > 0) {
              return roles
                .map((role) => {
                  switch (role) {
                    case 'admin':
                      return UserRoleLabelMapping.ADMIN;
                    case 'DefaultUser':
                      return UserRoleLabelMapping.DEFAULT_USER;
                    case 'Designer':
                      return UserRoleLabelMapping.DESIGNER;
                    default:
                      return;
                  }
                })
                .join(', ');
            }
            return UserRoleLabelMapping.UNASSIGNED;
          },
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
      skipCount: 0,
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
            <InputGroup w={{ base: '48%', sm: '30%', lg: '20%' }}>
              <Input
                isDisabled={isLoading || isRefetching}
                type="text"
                placeholder="Enter email"
                fontSize={{ base: '10px', sm: '12px', lg: '14px' }}
                mb={2}
                value={txtSearch}
                onChange={(e) => setTxtSearch(e.target.value)}
              />
              <InputRightElement width="40px">
                <TbSearch />
              </InputRightElement>
            </InputGroup>
            <Box>
              <SelectField
                isDisabled={isLoading || isRefetching}
                size="sm"
                rounded="md"
                mb={2}
                onChange={(e) =>
                  onUserListFilterChange('roles', e.target.value)
                }
                options={userRolesOptions}
              />
            </Box>
          </HStack>
          <IconButton
            isDisabled={isLoading || isRefetching}
            isRound={true}
            variant="solid"
            aria-label="Done"
            fontSize="20px"
            icon={<AiOutlineReload />}
            onClick={() => refetch()}
          />
        </HStack>
        <EmptyWrapper
          isEmpty={!requests.length && !isLoading}
          h="200px"
          fontSize="xs"
          message={'No request found!'}
        >
          <Box
            p={{ base: '10px 24px 0px' }}
            overflowX={'auto'}
            w={{
              base: `calc(100vw - ${sideBarWidth}px)`,
              lg: `calc(100vw - ${sideBarWidth}px)`,
              xs: 'max-content',
            }}
            data-testid="list-user-manager-settings-view"
          >
            <Table
              columns={userColumns}
              data={requests}
              sorting={sorting}
              onSortingChange={setSorting}
              isLoading={isLoading}
              pageSize={filterUser.maxResultCount}
              onRowHover={true}
              isHighlight={true}
              dataTestId="user-manager-item"
            />
          </Box>
        </EmptyWrapper>
        <HStack
          p={{
            base: '0px 12px 20px 12px',
            sm: '0px 30px 20px 30px',
            lg: '26px 30px 20px 30px',
          }}
          justifyContent={{
            base: 'center',
            lg: 'space-between',
          }}
          flexWrap="wrap"
        >
          <HStack
            alignItems="center"
            spacing="6px"
            flexWrap="wrap"
            px={{ base: '10px', sm: '12px', lg: '0px' }}
            pl={'-60px'}
          >
            <PageSize noOfRows={noOfRows} onChange={onPageSizeChange} />
            <Spacer w="2px" />
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
            data-testid="pagination"
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
