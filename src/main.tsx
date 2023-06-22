import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import AxiosProvider from 'api/AxiosProvider';
import QueryProvider from 'api/RequestProvider';
import { RecoilRoot } from 'recoil';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/index';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}>
      <AxiosProvider>
        <QueryProvider>
          <RecoilRoot>
            <ChakraProvider>
              <RouterProvider router={router} />
            </ChakraProvider>
          </RecoilRoot>
        </QueryProvider>
      </AxiosProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
