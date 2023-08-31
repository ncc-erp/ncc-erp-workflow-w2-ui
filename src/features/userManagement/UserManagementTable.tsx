import {
    ColumnDef,
    SortingState,
    createColumnHelper,
} from '@tanstack/react-table';
import { Box, Button, Center, HStack, Input, InputGroup, InputRightAddon, Spacer, Spinner } from '@chakra-ui/react';
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
import { UserModal } from './components/modal/UserModal';

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
    const [filter, setFilter] = useState<FilterUserParams>(initialFilter);
    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    const { data, isLoading } = useUserIdentity(filter);
    const { items: requests = [], totalCount = 0 } = data ?? {};
    const columnHelper = createColumnHelper<UserIdentity>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [user, setUser] = useState({});

    const currentPage = useMemo(() => {
        const { skipCount, maxResultCount } = filter;
        return (maxResultCount + skipCount) / maxResultCount;
    }, [filter]);

    const userColumns = useMemo(
        () =>
            [
                columnHelper.accessor('userName', {
                    id: 'userName',
                    header: () => <Box pl="16px">User name</Box>,
                    enableSorting: true,
                    sortDescFirst: true,
                    cell: (info) => <Box pl="16px">{info.getValue()}</Box>,
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
            ] as ColumnDef<Request>[],
        [columnHelper]
    );

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

    const onAction = (user: UserIdentity, type: 'Edit' | 'Permissions' | 'Delete') => () => {
        setUser(user);
        setIsModalOpen(true);
        // setUserId(userId);
        setModalTitle(type);
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <>
            <Box>
                <HStack w="full" pl="24px" pb="8px" align="space-between" flexWrap="wrap">
                    <Box w="220px">
                        <InputGroup borderRadius={5} size="sm">
                            <Input type="text" placeholder="Search..." border="1px solid #949494" />
                            <InputRightAddon p={0} border="none">
                                <Button size="sm" borderLeftRadius={0} borderRightRadius={3.3}>
                                    Search
                                </Button>
                            </InputRightAddon>
                        </InputGroup>
                    </Box>
                    <Box w="112px">
                        <Button onClick={() => {
                            setIsModalOpen(true);
                            setModalTitle('Create');
                        }}>New user</Button>
                    </Box>
                </HStack >
                {
                    isLoading ? (
                        <Center h="200px" >
                            <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
                        </Center >
                    ) : (
                        <EmptyWrapper
                            isEmpty={!requests.length}
                            h="200px"
                            fontSize="xs"
                            message={'No requests found!'}
                        >
                            <Box
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
                    py="20px"
                    px="24px"
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
                <UserModal
                    isOpen={isModalOpen}
                    onClose={onCloseModal}
                    user={user}
                    modalTitle={modalTitle}
                />
            </Box >
        </>
    );
};
