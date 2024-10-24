import { Box, Button } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { Table } from 'common/components/Table/Table';
import { useMemo, useState } from 'react';
import { CreateRoleModal } from './modals/CreateRoleWithPermissionsModal';
import { Roles } from 'models/roles';
import { AiOutlineEdit } from 'react-icons/ai';
import { useGetAllPermissions, useGetAllRoles } from 'api/apiHooks/roleHook';

export const RolesBoard = () => {
  const { data: rolesData, refetch: refetchRoles } = useGetAllRoles();
  const { data: permissionsData } = useGetAllPermissions();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const myColumns: ColumnDef<Roles>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Role Name',
        cell: (info) => info.getValue(),
        enableSorting: false,
      },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <span onClick={() => handleEdit(row.original)}>
            <AiOutlineEdit style={{ cursor: 'pointer', color: 'black' }} />
          </span>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const onOpenCreateModal = () => {
    setSelectedRoleId(null);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoleId(null);
    refetchRoles();
  };

  const handleEdit = (role: Roles) => {
    setSelectedRoleId(role.id);
    setIsModalOpen(true);
  };
  const handleModalSuccess = () => {
    refetchRoles();
  };
  return (
    <Box>
      <Box px={6}>
        <Button
          size="md"
          fontSize="sm"
          fontWeight="medium"
          colorScheme="green"
          onClick={onOpenCreateModal}
        >
          Create
        </Button>
      </Box>
      <EmptyWrapper
        isEmpty={!rolesData?.items.length}
        h="200px"
        fontSize="xs"
        message={'No roles found!'}
        boxSizing="border-box"
      >
        <Box
          w={{ base: '100%', lg: '100%', xs: 'max-content' }}
          p={{ base: '10px 24px 0px' }}
          paddingBottom={10}
        >
          <Table
            columns={myColumns}
            data={rolesData?.items || []}
            isLoading={false}
            onRowHover={true}
            isHighlight={true}
            dataTestId="roles-item"
          />
        </Box>
      </EmptyWrapper>
      {isModalOpen && (
        <CreateRoleModal
          isOpen={isModalOpen}
          onSuccess={handleModalSuccess}
          onClose={onCloseModal}
          permissions={Array.isArray(permissionsData) ? permissionsData : []}
          selectedRoleId={selectedRoleId}
        />
      )}
    </Box>
  );
};
