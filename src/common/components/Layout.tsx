import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { SideNav } from './SideBar';
import { useMediaQuery } from 'hooks/useMediaQuery';
import ScrollTopButton from './ScrollTopButton';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'common/components/ErrorBoundary/LayoutFallBack';
import SideBarErrorFallback from 'common/components/ErrorBoundary/SideBarFallBack';
import { useState } from 'react';

const Layout = () => {
  const [outletKey, setOutletKey] = useState(0);
  const [sidebarKey, setSideBarKey] = useState(0);
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const handleRetryMain = () => {
    setOutletKey((prev) => prev + 1);
  };
  const handleRetrySideBar = () => {
    setSideBarKey((prev) => prev + 1);
  };
  return (
    <Flex>
      <ErrorBoundary
        FallbackComponent={(props) => (
          <SideBarErrorFallback
            {...props}
            isLargeScreen={isLargeScreen}
            onRetry={handleRetrySideBar}
          />
        )}
        resetKeys={[sidebarKey]}
      >
        <SideNav isLargeScreen={isLargeScreen} />
      </ErrorBoundary>

      <Box
        style={{
          width: '100% !important',
          overflowX: 'hidden',
        }}
        flex={1}
      >
        <ErrorBoundary
          FallbackComponent={(props) => (
            <ErrorFallback {...props} onRetry={handleRetryMain} />
          )}
          resetKeys={[outletKey]}
        >
          <Outlet key={outletKey} />
        </ErrorBoundary>
        <ScrollTopButton />
      </Box>
    </Flex>
  );
};

export default Layout;
