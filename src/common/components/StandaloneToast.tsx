import { createStandaloneToast } from '@chakra-ui/react';

export const { ToastContainer, toast } = createStandaloneToast({
  defaultOptions: {
    duration: 3000,
    position: 'top',
    isClosable: true,
  },
});
