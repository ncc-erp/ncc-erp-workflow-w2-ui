import {
  Divider,
  HStack,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  AspectRatio,
} from '@chakra-ui/react';
import Logo from 'assets/images/ncc_logo.png';
const { VITE_PROXY_SERVER_URL } = import.meta.env;

interface IWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowId: string;
}

export const WorkflowModal = ({
  isOpen,
  onClose,
  workflowId,
}: IWorkflowModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="10px" maxW="900px">
        <ModalHeader>
          <HStack>
            <Image h="45px" src={Logo} />
            <Heading ml={1} w="550px">
              <Text fontSize={16} fontWeight={400} mt={1.5}>
                Workflow Detail
              </Text>
            </Heading>
          </HStack>
        </ModalHeader>
        <ModalCloseButton mt="15px" mr="10px" />
        <ModalBody>
          <Divider mb={5}></Divider>
          <AspectRatio maxW="100%" ratio={1}>
            <iframe
              title="Workflow Details"
              src={VITE_PROXY_SERVER_URL + '/ViewDesigner?id=' + workflowId}
            />
          </AspectRatio>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
