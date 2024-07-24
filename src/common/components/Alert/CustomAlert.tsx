import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';

interface CustomAlertProps {
  title: string;
  description: string;
  status: 'error' | 'success' | 'info' | 'warning';
  onClose: () => void;
}

const CustomAlert = ({
  title,
  description,
  status,
  onClose,
}: CustomAlertProps) => {
  return (
    <Alert
      status={status}
      bgColor={'#ffffff'}
      variant="subtle"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      px={4}
      py={4}
      border="1px"
      borderColor={'#D0D5DD'}
      borderStyle="solid"
      borderRadius={12}
    >
      <AlertIcon boxSize="24px" mr={0} />
      <AlertTitle
        color={'#344054'}
        fontWeight={600}
        mt={4}
        mb={1}
        fontSize={'14px'}
        lineHeight={'20px'}
      >
        {title}
      </AlertTitle>
      <AlertDescription
        fontWeight={400}
        lineHeight={'20px'}
        fontSize={'14px'}
        maxWidth="sm"
      >
        {description}
      </AlertDescription>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={onClose}
      />
    </Alert>
  );
};

export default CustomAlert;
