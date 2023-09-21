import { useRef } from 'react';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';

interface ModalBoardProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showReason: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  setReason: React.Dispatch<React.SetStateAction<string>>;
}

const ModalBoard = (props: ModalBoardProps): JSX.Element => {
  const cancelRef = useRef(null);
  const {
    isDisabled = false,
    isLoading = false,
    isOpen,
    onClose,
    onConfirm,
    showReason = false,
    setReason,
  } = props;
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" pb={1}>
              Update status
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text
                whiteSpace="nowrap"
                fontSize="md"
                fontWeight="medium"
                pb={0}
              >
                Do you want to update status ?
              </Text>
              {showReason && (
                <Box mt={5}>
                  <Text
                    whiteSpace="nowrap"
                    fontSize="md"
                    fontWeight="medium"
                    pb={2}
                    pt={0}
                  >
                    Reason *
                  </Text>
                  <Input
                    type="text"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Box>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={onConfirm}
                ml={3}
                isDisabled={isDisabled || isLoading}
              >
                {isLoading ? <Spinner /> : 'Confirm'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ModalBoard;
