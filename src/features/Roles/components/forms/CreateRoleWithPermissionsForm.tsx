import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  VStack,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import PermissionCheckbox from 'common/components/PermissionCheckbox';
import { Permissions } from 'models/permissions';
import { Role } from 'models/roles';
import { Avatar } from '@chakra-ui/react';
import { ModalConfirm } from 'common/components/ModalConfirm';
import { useDeleteRole, useGetAllRoles } from 'api/apiHooks/roleHook';

interface CreateRoleWithPermissionsProps {
  onClose: () => void;
  onSubmit: (roleName: string, selectedPermissions: string[]) => void;
  permissions: Permissions[];
  isOpen: boolean;
  initialRoleName?: string;
  role?: Role;
}

const CreateRoleWithPermissionsForm: React.FC<
  CreateRoleWithPermissionsProps
> = ({ onClose, onSubmit, permissions, initialRoleName = '', role }) => {
  const [roleName, setRoleName] = useState(initialRoleName);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isTreeModified, setIsTreeModified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState<string | null>(null);
  const { mutate: deleteRole } = useDeleteRole();
  const { refetch: refetchRoles } = useGetAllRoles();

  const handleOpenModal = (id: string) => {
    setRoleIdToDelete(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRoleIdToDelete(null);
  };

  useEffect(() => {
    setRoleName(initialRoleName);
  }, [initialRoleName]);

  const handleCheckboxChange = (updatedSelection: string[]) => {
    setSelectedPermissions(updatedSelection);
    setIsTreeModified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCodePermissions: string[] = [];
    role?.permissions?.forEach((perm) => {
      newCodePermissions.push(perm.code);
      perm.children?.forEach((child) => {
        newCodePermissions.push(child.code);
      });
    });
    const permissionsToSubmit = isTreeModified
      ? selectedPermissions
      : newCodePermissions;
    onSubmit(roleName, permissionsToSubmit);
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (roleIdToDelete) {
      await deleteRole(roleIdToDelete);
      await refetchRoles();
    }
    setIsModalOpen(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <VStack spacing="14px">
        <FormControl mb={3}>
          <FormLabel fontWeight={500}>Role Name</FormLabel>
          <Input
            mt={3}
            placeholder="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
        </FormControl>
        <Tabs
          size="md"
          variant="enclosed"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
          }}
        >
          <TabList>
            <Tab fontSize="16px" fontWeight="medium">
              Permissions
            </Tab>
            <Tab fontSize="16px" fontWeight="medium">
              Users
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel style={{ maxHeight: '300px' }}>
              <FormControl>
                <PermissionCheckbox
                  permission={permissions}
                  onChange={handleCheckboxChange}
                  style={{ fontSize: '16px', color: 'black' }}
                  role={role}
                />
              </FormControl>
            </TabPanel>
            <TabPanel
              p="0"
              style={{
                overflowY: 'auto',
                maxHeight: '310px',
                marginTop: '20px',
              }}
            >
              {role?.users?.length ? (
                role.users.map((user) => (
                  <VStack key={user.id} align="start" spacing="4px">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '10px 0px',
                      }}
                    >
                      <Avatar name={user.name} size="sm" mr="8px" />
                      <div style={{ fontSize: '14px' }}>{user.name}</div>
                    </div>
                  </VStack>
                ))
              ) : (
                <VStack
                  style={{
                    height: '180px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div>No users available</div>
                  <Button
                    colorScheme="red"
                    onClick={() => role && handleOpenModal(role.id)}
                  >
                    Delete Role
                  </Button>
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Button mt="14px" type="submit" width="full">
          {role ? 'Update' : 'Create'}
        </Button>
      </VStack>
      <ModalConfirm
        title="Delete Confirmation"
        description="Are you sure you want to delete this role?"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </form>
  );
};

export default CreateRoleWithPermissionsForm;
