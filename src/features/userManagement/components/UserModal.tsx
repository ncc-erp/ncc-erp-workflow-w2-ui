import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { UserAction } from 'common/constants';
import UserForm from './UserForm';
import { ModalUserParams, UserIdentity } from 'models/userIdentity';
import { useRoleByUserId } from 'api/apiHooks/userIdentityHooks';
import { Role } from 'models/roles';
import styles from './style.module.scss';

interface IUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  user: UserIdentity;
}

export const UserModal = ({
  isOpen,
  onClose,
  modalTitle,
  user,
}: IUserModalProps) => {
  const { data: rolesList } = useRoleByUserId(user.id);
  const itemsArray = Object.values(rolesList || []);
  let initialValues: ModalUserParams;
  let UserComponent;
  if (rolesList) {
    initialValues = {
      userName: user?.userName,
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      isActive: user?.isActive,
      lockoutEnabled: user?.lockoutEnabled,
      roleNames: itemsArray[0]?.map((role: Role) => role.name),
      mezonUserId: user?.mezonUserId || '',
    };
    UserComponent = {
      [UserAction.EDIT]: (
        <UserForm
          initialValues={initialValues}
          userId={user.id}
          onClose={onClose}
          isOpen={isOpen}
        />
      ),
      [UserAction.PERMISSIONS]: <></>,
      [UserAction.DELETE]: <></>,
    };
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent className={styles.modalContent}>
        <ModalHeader fontSize="18px">{modalTitle} user</ModalHeader>
        <ModalCloseButton />
        {UserComponent && <ModalBody>{UserComponent[modalTitle]}</ModalBody>}
      </ModalContent>
    </Modal>
  );
};
