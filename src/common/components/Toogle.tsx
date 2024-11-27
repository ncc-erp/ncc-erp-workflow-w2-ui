import { Button, Text, useColorMode } from '@chakra-ui/react';
import { LinkDocRedirect } from 'common/constants';
import { LocalStorageKeys } from 'common/enums';
import { useMediaQuery } from 'hooks/useMediaQuery';
import {} from 'react-icons';
import { FaMoon, FaSun } from 'react-icons/fa';
import { HiDocumentText } from 'react-icons/hi';
import { HiDocumentArrowUp, HiOutlinePower } from 'react-icons/hi2';
import { useNavigate } from 'react-router';
import { removeItem } from 'utils';

export const Toggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const navigate = useNavigate();
  const onNavigate = (to: string, logout?: boolean) => () => {
    if (logout) {
      removeItem(LocalStorageKeys.accessToken);
    }
    navigate(to);
  };
  return (
    <div>
      <Button
        mr={2}
        padding={0}
        borderRadius={20}
        onClick={onNavigate('/login', true)}
        bg="transparent"
        title="Log out"
        hidden={isLargeScreen ? false : true}
      >
        <HiOutlinePower size="20px" />
      </Button>
      <Button
        mr={2}
        padding={0}
        borderRadius={20}
        onClick={onNavigate('/release-content')}
        title="Release note"
        bg="transparent"
        hidden={isLargeScreen ? false : true}
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
        hidden={isLargeScreen ? false : true}
      >
        <HiDocumentText size="20px" />
      </Button>

      <Button
        size="md"
        borderRadius={20}
        onClick={() => toggleColorMode()}
        hidden={isLargeScreen ? false : true}
      >
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
