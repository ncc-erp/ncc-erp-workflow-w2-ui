import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import styles from '../style.module.scss';
import CreateForm from '../forms/CreateForm';
import { IJsonObject } from 'models/request';
import { useTranslation } from 'react-i18next';
interface RequestTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowCreateData?: IJsonObject | null;
  OnCreateSuccess: (workflowId: string) => void;
}

export const CreateTemplateModal = ({
  isOpen,
  onClose,
  workflowCreateData,
  OnCreateSuccess,
}: RequestTemplateModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <ModalHeader fontSize="md">
          {t('REQUEST_TEMPLATES_PAGE.CREATE_WORKFLOW_DEFINITION.TITLE')}
        </ModalHeader>
        <Divider></Divider>
        <ModalCloseButton />
        <ModalBody>
          <CreateForm
            onCloseModal={onClose}
            onSuccess={OnCreateSuccess}
            workflowCreateData={workflowCreateData}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
