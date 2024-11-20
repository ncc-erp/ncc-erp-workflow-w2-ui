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
  IconButton,
  HStack,
} from '@chakra-ui/react';
import PermissionCheckbox from 'common/components/PermissionCheckbox';
import { Permissions } from 'models/permissions';
import { Role } from 'models/roles';
import { Avatar } from '@chakra-ui/react';
import { ModalConfirm } from 'common/components/ModalConfirm';
import {
  useDeleteRole,
  useRemoveUserFromRole,
  useGetAllRoles,
  useGetOneRole,
} from 'api/apiHooks/roleHook';
import { DeleteIcon } from '@chakra-ui/icons';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions as PermissionConstants } from 'common/constants';

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
  const { mutate: deleteRoleUser } = useRemoveUserFromRole();
  const { data: selectedRole } = useGetOneRole(role?.id || '');
  const { renderIfAllowed } = useUserPermissions();

  const [users, setUsers] = useState(selectedRole?.users || []);

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

  useEffect(() => {
    if (selectedRole) {
      setUsers(selectedRole.users);
    }
  }, [selectedRole]);

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

  const handleDeleteUser = async (roleId: string, userId: string) => {
    await deleteRoleUser({ roleId, userId });
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };
  console.log(PermissionConstants.DELETE_ROLE);

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
            <TabPanel>
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
              {users.length ? (
                users.map((user) => (
                  <HStack
                    key={user.id}
                    spacing="4px"
                    justify="space-between"
                    width="100%"
                    paddingRight="10px"
                  >
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
                    {renderIfAllowed(
                      PermissionConstants.DELETE_USER_ON_ROLE,
                      <IconButton
                        aria-label="Delete user"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          if (selectedRole) {
                            handleDeleteUser(selectedRole.id, user.id);
                          }
                        }}
                      />
                    )}
                  </HStack>
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
                  {renderIfAllowed(
                    PermissionConstants.DELETE_ROLE,
                    <Button
                      colorScheme="red"
                      onClick={() => role && handleOpenModal(role.id)}
                    >
                      Delete Role
                    </Button>
                  )}
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
