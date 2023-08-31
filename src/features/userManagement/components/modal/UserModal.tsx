import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { UserAction } from 'common/constants';
import UserForm from '../form/UserForm';
import { ModalUserParams, UserIdentity } from 'models/userIdentity';

interface IUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    modalTitle: string;
    user: UserIdentity;
}

export const UserModal = ({ isOpen, onClose, modalTitle, user}: IUserModalProps) => {
     const initialValues: ModalUserParams = {
        userName: user.userName,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive,
        lockoutEnabled: user.lockoutEnabled
    };
    
    const UserComponent = {
        [UserAction.EDIT]: <UserForm initialValues={initialValues} />,
        [UserAction.PERMISSIONS]: <></>,
        [UserAction.DELETE]: <></>,
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{modalTitle}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{UserComponent[modalTitle]}</ModalBody>
            </ModalContent>
        </Modal>
    );
};