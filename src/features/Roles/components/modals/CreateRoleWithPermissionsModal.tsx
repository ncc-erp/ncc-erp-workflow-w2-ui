import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import CreateRoleWithPermissionsForm from '../forms/CreateRoleWithPermissionsForm';
import { Permissions } from 'models/permissions';
import { toast } from 'common/components/StandaloneToast';
import {
  useGetOneRole,
  useCreateRole,
  useUpdateRole,
} from 'api/apiHooks/roleHook';
import { useEffect } from 'react';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: Permissions[];
  initialRoleName?: string;
  selectedRoleId: string | null;
  onSuccess: () => void;
}

export const CreateRoleModal = ({
  isOpen,
  onClose,
  permissions,
  initialRoleName = '',
  selectedRoleId,
  onSuccess,
}: CreateRoleModalProps) => {
  const { data: selectedRole, refetch } = useGetOneRole(selectedRoleId || '');
  const { mutate: createRole } = useCreateRole();
  const { mutate: updateRole } = useUpdateRole();

  const roleName = selectedRole ? selectedRole.name : initialRoleName;

  useEffect(() => {
    if (isOpen && selectedRoleId && refetch) {
      refetch();
    }
  }, [isOpen, selectedRoleId, refetch]);

  const handleSubmit = async (
    roleName: string,
    selectedPermissions: string[]
  ) => {
    try {
      await (selectedRoleId
        ? updateRole({
            id: selectedRoleId,
            data: { name: roleName, permissionCodes: selectedPermissions },
          })
        : createRole({ name: roleName, permissionCodes: selectedPermissions }));
      toast({
        description: `Role ${
          selectedRoleId ? 'updated' : 'created'
        } successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        description: `Failed to ${
          selectedRoleId ? 'updated' : 'created'
        }the role.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent style={{ minWidth: '20%' }}>
        <ModalHeader fontSize="lg">
          {selectedRoleId ? 'Edit Role' : 'Create Role'}
        </ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody>
          <CreateRoleWithPermissionsForm
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            permissions={permissions}
            initialRoleName={selectedRoleId ? roleName : ''}
            role={selectedRoleId ? selectedRole : undefined}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
