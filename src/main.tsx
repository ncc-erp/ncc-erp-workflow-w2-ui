import theme from 'themes/theme';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ChakraProvider,
  ColorModeScript,
  createLocalStorageManager,
} from '@chakra-ui/react';
import AxiosProvider from 'api/AxiosProvider';
import QueryProvider from 'api/RequestProvider';
import { RecoilRoot } from 'recoil';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/index';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'common/components/StandaloneToast';

const manager = createLocalStorageManager('chakra-ui-color-mode');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}>
      <AxiosProvider>
        <QueryProvider>
          <RecoilRoot>
            <ChakraProvider theme={theme} colorModeManager={manager}>
              <ColorModeScript
                initialColorMode={theme.config.initialColorMode}
              />
              <RouterProvider router={router} />
            </ChakraProvider>
            <ToastContainer />
          </RecoilRoot>
        </QueryProvider>
      </AxiosProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
