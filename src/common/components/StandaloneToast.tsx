import { createStandaloneToast } from '@chakra-ui/react';
import theme from 'theme';

export const { ToastContainer, toast } = createStandaloneToast({
  theme,
  defaultOptions: {
    duration: 3000,
    position: 'top',
    isClosable: true,
  },
});
