import { Box, Button, Center, IconButton } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { Table } from 'common/components/Table/Table';
import { useMemo, useState } from 'react';
import { CreateRoleModal } from './modals/CreateRoleWithPermissionsModal';
import { Role } from 'models/roles';
import { AiOutlineEdit } from 'react-icons/ai';
import { useGetAllPermissions, useGetAllRoles } from 'api/apiHooks/roleHook';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';

export const RolesBoard = () => {
  const { data: rolesData, refetch: refetchRoles } = useGetAllRoles();
  const { data: permissionsData } = useGetAllPermissions();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const { renderIfAllowed, hasPermission } = useUserPermissions();

  const myColumns: ColumnDef<Role>[] = useMemo(() => {
    return [
      {
        accessorKey: 'name',
        header: 'Role Name',
        cell: (info) => info.row.original.name,
        enableSorting: false,
      },
      ...(hasPermission(Permissions.UPDATE_ROLE)
        ? [
            {
              accessorKey: 'action',
              header: () => <Center w="full">Action</Center>,
              cell: ({ row }: { row: { original: Role } }) => (
                <Center>
                  <IconButton
                    onClick={() => handleEdit(row.original)}
                    aria-label="edit modal"
                    icon={<AiOutlineEdit />}
                    backgroundColor="actionBtnBg"
                    color="paginationText"
                  />
                </Center>
              ),
              enableSorting: false,
            },
          ]
        : []),
    ];
  }, [hasPermission]);

  const onOpenCreateModal = () => {
    setSelectedRoleId(null);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoleId(null);
    refetchRoles();
  };

  const handleEdit = (role: Role) => {
    setSelectedRoleId(role.id);
    setIsModalOpen(true);
  };
  const handleModalSuccess = () => {
    refetchRoles();
  };
  return (
    <>
      {renderIfAllowed(
        Permissions.VIEW_ROLES,
        <Box>
          {renderIfAllowed(
            Permissions.CREATE_ROLE,
            <Box>
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
          )}
          <EmptyWrapper
            isEmpty={!rolesData?.items.length}
            h="200px"
            fontSize="xs"
            message={'No roles found!'}
            boxSizing="border-box"
          >
            <Box
              w={{ base: '100%', lg: '100%', xs: 'max-content' }}
              pt="10px"
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
              permissions={
                Array.isArray(permissionsData) ? permissionsData : []
              }
              selectedRoleId={selectedRoleId}
            />
          )}
        </Box>
      )}
    </>
  );
};
