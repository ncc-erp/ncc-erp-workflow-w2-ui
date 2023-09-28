import { Button, Text, useColorMode } from '@chakra-ui/react';
import {} from 'react-icons';
import { FaMoon, FaSun } from 'react-icons/fa';

export const Toggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div>
      <Button size="md" borderRadius={20} onClick={() => toggleColorMode()}>
        {colorMode === 'light' ? (
          <>
            <FaMoon />
            <Text ml={2}>Dark</Text>
          </>
        ) : (
          <>
            <FaSun />
            <Text ml={2}>Light</Text>
          </>
        )}
      </Button>
    </div>
  );
};
