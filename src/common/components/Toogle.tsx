import { Button, Text, useColorMode } from '@chakra-ui/react';
import { LinkDocRedirect } from 'common/constants';
import {} from 'react-icons';
import { FaMoon, FaSun } from 'react-icons/fa';
import { HiDocumentText } from 'react-icons/hi';
import { HiDocumentArrowUp } from 'react-icons/hi2';

export const Toggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div>
      <Button
        mr={2}
        padding={0}
        borderRadius={20}
        onClick={() => {
          window.open(LinkDocRedirect.RELEASE_DOCS, '_blank');
        }}
        title="Release note"
        bg="transparent"
      >
        <HiDocumentArrowUp size="20px" />
      </Button>

      <Button
        mr={2}
        padding={0}
        borderRadius={20}
        onClick={() => {
          window.open(LinkDocRedirect.USER_GUIDE_DOCS, '_blank');
        }}
        title="User guide"
        bg="transparent"
      >
        <HiDocumentText size="20px" />
      </Button>

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
