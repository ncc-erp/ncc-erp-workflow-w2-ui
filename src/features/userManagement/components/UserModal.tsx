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

interface IUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    modalTitle: string;
    user: UserIdentity;
}

export const UserModal = ({ isOpen, onClose, modalTitle, user }: IUserModalProps) => {
    const { data: rolesList } = useRoleByUserId(user.id);

    let initialValues: ModalUserParams;
    let UserComponent;
    if (rolesList) {
        initialValues = {
            userName: user?.userName,
            name: user?.name,
            surname: user?.surname,
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            isActive: user?.isActive,
            lockoutEnabled: user?.lockoutEnabled,
            roleNames: rolesList?.items.map((role) => role.name),
        };
        UserComponent = {
            [UserAction.EDIT]: <UserForm initialValues={initialValues} userId={user.id} onClose={onClose} />,
            [UserAction.PERMISSIONS]: <></>,
            [UserAction.DELETE]: <></>,
        };
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{modalTitle}</ModalHeader>
                <ModalCloseButton />
                {UserComponent && <ModalBody>{UserComponent[modalTitle]}</ModalBody>}
            </ModalContent>
        </Modal>
    );
};