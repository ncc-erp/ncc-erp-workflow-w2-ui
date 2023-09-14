import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import ChangeOfficeRequestForm from './forms/ChangeOfficeRequestForm';
import { RequestTemplateWorkflow } from 'common/constants';
import OfficeEquipmentRequestForm from './forms/OfficeEquipmentRequestForm';
import WfhRequestForm from './forms/WfhRequestForm';
import DeviceRequestForm from './forms/DeviceRequestForm';
interface RequestTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName?: string;
  requestId: string;
  workflow: string;
}
const workflowComponents = {
  [RequestTemplateWorkflow.CHANGE_OFFICE]: <ChangeOfficeRequestForm />,
  [RequestTemplateWorkflow.OFFICE_EQUIPMENT]: <OfficeEquipmentRequestForm />,
  [RequestTemplateWorkflow.DEVICE_REQUEST]: <DeviceRequestForm />,
  [RequestTemplateWorkflow.WFH_REQUEST]: <WfhRequestForm />,
};

export const RequestTemplateModal = ({
  isOpen,
  onClose,
  displayName,
  workflow,
}: RequestTemplateModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="18px">{displayName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{workflowComponents[workflow]}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
