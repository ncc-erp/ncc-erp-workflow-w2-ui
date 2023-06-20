import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import AxiosProvider from 'api/AxiosProvider';
import QueryProvider from 'api/RequestProvider';
import { RecoilRoot } from 'recoil';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/index';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AxiosProvider>
      <QueryProvider>
        <RecoilRoot>
          <ChakraProvider>
            <RouterProvider router={router} />
          </ChakraProvider>
        </RecoilRoot>
      </QueryProvider>
    </AxiosProvider>
  </React.StrictMode>
);
