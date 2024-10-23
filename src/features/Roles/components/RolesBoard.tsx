import { Box, Button } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { Table } from 'common/components/Table/Table';
import { useMemo, useState } from 'react';
import { CreateRoleModal } from './modals/CreateRoleWithPermissionsModal';
import { Roles } from 'models/roles';
import {
  useCreateRole,
  useGetAllPermissions,
  useGetAllRoles,
} from 'api/apiHooks/roleHook';
export const RolesBoard = () => {
  const { data: rolesData, refetch: refetchRoles } = useGetAllRoles();
  const { data: permissionsData } = useGetAllPermissions();
  const { mutate: createRole } = useCreateRole();
  const isLoading = false;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const myColumns: ColumnDef<Roles>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Role Name',
        cell: (info) => info.getValue(),
      },
    ],
    []
  );
  const handleCreateSuccess = (name: string, permissionNames: string[]) => {
    const newRole = {
      name,
      permissionNames,
    };
    createRole(newRole, {
      onSuccess: () => {
        refetchRoles();
        setIsModalOpen(false);
      },
    });
  };

  const onOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
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
        isEmpty={!rolesData?.items.length && !isLoading}
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
            isLoading={isLoading}
            onRowHover={true}
            isHighlight={true}
            dataTestId="roles-item"
          />
        </Box>
      </EmptyWrapper>
      <CreateRoleModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        OnCreateSuccess={handleCreateSuccess}
        permissions={Array.isArray(permissionsData) ? permissionsData : []}
      />
    </Box>
  );
};
