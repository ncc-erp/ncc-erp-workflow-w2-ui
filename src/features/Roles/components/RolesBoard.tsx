import { Box, Button } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { Table } from 'common/components/Table/Table';
import { useMemo, useState } from 'react';
import { CreateRoleModal } from './modals/CreateRoleWithPermissionsModal';
import { RolePermission } from 'models/roles';
import { AiOutlineEdit } from 'react-icons/ai';

const mockPermissions = [
  {
    id: 1,
    name: 'User Management',
    children: [
      { id: 2, name: 'Create User' },
      { id: 3, name: 'Edit User' },
      { id: 4, name: 'Delete User' },
      { id: 5, name: 'View Users' },
    ],
  },
  {
    id: 6,
    name: 'Roles Management',
    children: [
      { id: 7, name: 'Create Role' },
      { id: 8, name: 'Edit Role' },
      { id: 9, name: 'Delete Role' },
      { id: 10, name: 'View Roles' },
    ],
  },
  {
    id: 11,
    name: 'Request templates',
    children: [
      { id: 12, name: 'Create Content' },
      { id: 13, name: 'Edit Content' },
      { id: 14, name: 'Delete Content' },
      { id: 15, name: 'Publish Content' },
      { id: 16, name: 'View Content' },
    ],
  },
  {
    id: 17,
    name: 'Reports',
    children: [
      { id: 18, name: 'View Reports' },
      { id: 19, name: 'Export Reports' },
      { id: 20, name: 'Generate Reports' },
    ],
  },
  {
    id: 21,
    name: 'Settings',
    children: [
      { id: 22, name: 'Edit Settings' },
      { id: 23, name: 'Manage API Keys' },
      { id: 24, name: 'Configure Notifications' },
    ],
  },
  {
    id: 25,
    name: 'Audit Logs',
    children: [
      { id: 26, name: 'View Logs' },
      { id: 27, name: 'Export Logs' },
      { id: 28, name: 'Delete Logs' },
    ],
  },
  {
    id: 25,
    name: 'Audit Logs',
    children: [
      { id: 26, name: 'View Logs' },
      { id: 27, name: 'Export Logs' },
      { id: 28, name: 'Delete Logs' },
    ],
  },
  {
    id: 25,
    name: 'Audit Logs',
    children: [
      { id: 26, name: 'View Logs' },
      { id: 27, name: 'Export Logs' },
      { id: 28, name: 'Delete Logs' },
    ],
  },
];

export const RolesBoard = () => {
  const [mockData, setMockData] = useState<RolePermission[]>([
    { roleName: 'Admin' },
    { roleName: 'User' },
    { roleName: 'Editor' },
    { roleName: 'Viewer' },
    { roleName: 'Manager' },
    { roleName: 'Contributor' },
    { roleName: 'Moderator' },
    { roleName: 'Analyst' },
    { roleName: 'Developer' },
    { roleName: 'Designer' },
    { roleName: 'Support' },
    { roleName: 'Sales' },
    { roleName: 'Marketing' },
    { roleName: 'HR' },
    { roleName: 'Finance' },
  ]);
  const isLoading = false;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const myColumns: ColumnDef<RolePermission>[] = useMemo(
    () => [
      {
        accessorKey: 'roleName',
        header: 'Role Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Button size="sm" onClick={() => handleEdit(info.row.original)}>
            <AiOutlineEdit />
          </Button>
        ),
      },
    ],
    []
  );

  const handleCreateSuccess = (roleName: string, permissionName: string[]) => {
    const newRole = {
      roleName,
      permissionName,
    };
    setMockData((prevData) => [...prevData, newRole]);
    setIsModalOpen(false);
  };
  console.log(mockData);

  const onOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleEdit = (role: RolePermission) => {
    console.log('Edit role:', role);
    // Thêm logic để chỉnh sửa vai trò ở đây
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
        isEmpty={!mockData.length && !isLoading}
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
            data={mockData}
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
        permissions={mockPermissions}
      />
    </Box>
  );
};
