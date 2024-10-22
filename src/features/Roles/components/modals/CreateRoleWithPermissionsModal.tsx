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

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  OnCreateSuccess: (roleName: string, selectedPermissions: string[]) => void;
  permissions: { id: number; name: string }[];
}

export const CreateRoleModal = ({
  isOpen,
  onClose,
  OnCreateSuccess,
  permissions,
}: CreateRoleModalProps) => {
  const handleCreateRole = (
    roleName: string,
    selectedPermissions: string[]
  ) => {
    OnCreateSuccess(roleName, selectedPermissions);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent style={{ minWidth: '50%' }}>
        <ModalHeader fontSize="lg">Create Role</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody>
          <CreateRoleWithPermissionsForm
            isOpen={isOpen}
            onClose={onClose}
            onSuccess={handleCreateRole}
            permissions={permissions}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
