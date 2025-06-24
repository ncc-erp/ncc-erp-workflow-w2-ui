import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Badge,
  Box,
  Center,
  Flex,
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
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { FilterUserParams, UserIdentity } from 'models/userIdentity';
import { useRoles, useUserIdentity } from 'api/apiHooks/userIdentityHooks';
import { RowAction } from './RowAction';
import { UserModal } from './UserModal';
import useDebounced from 'hooks/useDebounced';
import { TbSearch } from 'react-icons/tb';
import { convertToCase, formatDate, getSortingState } from 'utils';
import { SelectField } from 'common/components/SelectField';
import { AiOutlineReload } from 'react-icons/ai';
import { UserRoleLabelMapping } from '../../../common/constants';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import { useGetAllRoles } from 'api/apiHooks/roleHook';
import { PaginationMobile } from 'common/components/PaginationMobile';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { useSyncFilterQuery } from 'hooks/useSyncFilterQuery';
const initialFilter: FilterUserParams = {
  filter: '',
  maxResultCount: +noOfRows[0].value,
  skipCount: 0,
  sorting: [UserSortField.userName, 'asc'].join(' '),
  role: '',
};

const initialSorting: SortingState = [
  {
    id: UserSortField.userName,
    desc: false,
  },
];

export const UserManagementTable = () => {
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const [filterUser, setFilterUser] =
    useSyncFilterQuery<FilterUserParams>(initialFilter);
  const [sorting, setSorting] = useState<SortingState>(() => {
    return getSortingState(filterUser.sorting, initialSorting);
  });
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
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
  const { hasPermission } = useUserPermissions();
  const { data: rolesData } = useGetAllRoles();
  const onUserListFilterChange = useCallback(
    (key: 'sorting' | 'role' | 'filter', value?: string) => {
      setFilterUser((filterUser) => ({
        ...filterUser,
        [key]: value === 'empty' ? 'empty' : value,
        skipCount: 0,
      }));
    },
    [setFilterUser]
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
    return [
      { value: '', label: 'All Roles' },
      { value: 'empty', label: 'No Role' },
      ...result,
    ];
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
                  const foundRole = rolesData?.items?.find(
                    (r) => r.name === role
                  );
                  return foundRole ? foundRole.name : role;
                })
                .join(', ');
            }
            return UserRoleLabelMapping.UNASSIGNED;
          },
        }),
        columnHelper.accessor('mezonUserId', {
          id: 'mezonUserId',
          header: 'Mezon User ID',
          enableSorting: true,
          cell: (info) => {
            return info.getValue() || 'N/A';
          },
        }),
        columnHelper.accessor('creationTime', {
          id: 'creationTime',
          header: 'Create time',
          enableSorting: true,
          cell: (info) => formatDate(info.getValue()),
        }),
        columnHelper.accessor('lastModificationTime', {
          id: 'lastModificationTime',
          header: 'Update time',
          enableSorting: true,
          cell: (info) => formatDate(info.getValue()),
        }),
        hasPermission(Permissions.UPDATE_USER) &&
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
      ].filter(Boolean) as ColumnDef<UserIdentity>[],
    [columnHelper, hasPermission, rolesData?.items]
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
      skipCount: sort !== filter.sorting ? 0 : filter.skipCount,
    }));
  }, [setFilterUser, sorting]);

  useEffect(() => {
    const paramsFilter = filterUser.filter ? filterUser.filter : '';
    if (paramsFilter !== txtSearchDebounced) {
      setFilterUser((filterUser) => ({
        ...filterUser,
        filter: txtSearchDebounced,
        skipCount: 0,
      }));
    }
  }, [setFilterUser, txtSearchDebounced, filterUser.filter]);

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
      <Flex pb="8px" flexDirection={['column', 'row']} gap="8px">
        <Flex flex={1} flexDirection={['column', 'row']} gap="8px">
          <InputGroup flexBasis={{ sm: '296px' }}>
            <Input
              isDisabled={isLoading || isRefetching}
              type="text"
              placeholder="Enter email"
              fontSize={{ base: '12px', lg: '14px' }}
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
              onChange={(e) => onUserListFilterChange('role', e.target.value)}
              options={userRolesOptions}
              minW="134px"
            />
          </Box>
        </Flex>
        <IconButton
          isDisabled={isLoading || isRefetching}
          isRound={true}
          variant="solid"
          aria-label="Done"
          fontSize="20px"
          icon={<AiOutlineReload />}
          onClick={() => refetch()}
          ml="auto"
        />
      </Flex>
      <EmptyWrapper
        isEmpty={!requests.length && !isLoading}
        h="200px"
        fontSize="xs"
        message={'No request found!'}
      >
        <Box
          pt="10px"
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
              value={filterUser.maxResultCount}
            />
            <Spacer w="12px" />
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
      ) : (
        <HStack
          display={'flex'}
          width={'100%'}
          p={['0px 16px 20px 16px', '0px 16px 20px 16px']}
          justifyContent={['center', 'space-between']}
        >
          <PaginationMobile
            total={data?.totalCount ?? 0}
            pageSize={filterUser.maxResultCount}
            current={currentPage}
            onChange={onPageChange}
            hideOnSinglePage
            data-testid="pagination"
          />
        </HStack>
      )}
      {user && (
        <UserModal
          isOpen={isModalOpen}
          onClose={onCloseModal}
          user={user}
          modalTitle={modalTitle}
        />
      )}
    </>
  );
};
