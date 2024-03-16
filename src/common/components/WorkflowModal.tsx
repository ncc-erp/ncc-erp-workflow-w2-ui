import {
  AspectRatio,
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
} from '@chakra-ui/react';
import Logo from 'assets/images/ncc_logo.png';
import { LocalStorageKeys } from 'common/enums';
import { useMemo } from 'react';
import { getItem } from 'utils';
import IFrame from './IFrame';

interface IWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: string;
}

export const WorkflowModal = ({
  isOpen,
  onClose,
  workflow,
}: IWorkflowModalProps) => {
  const token: string | null = useMemo(() => {
    return getItem(LocalStorageKeys.accessToken);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="5px" maxW="90vw" maxH="90vh" overflow="hidden">
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
            <IFrame
              src={`${window.location.origin}/${workflow}`}
              headers={{
                Authorization: `Bearer ${token}`,
              }}
            />
          </AspectRatio>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
