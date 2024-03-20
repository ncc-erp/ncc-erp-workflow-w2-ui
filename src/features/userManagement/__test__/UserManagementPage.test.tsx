import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import UserManagement from '..';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../../api/apiHooks/index', () => ({
  useAxios: jest.fn(),
}));

jest.mock('../../../api/axiosInstant', () => ({
  VITE_API_BASE_URL: '/api',
}));

jest.mock('hooks/useIsAdmin', () => ({
  useIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock('hooks/useMediaQuery', () => ({
  useMediaQuery: jest.fn().mockReturnValue(true),
}));

jest.mock('api/apiHooks/userIdentityHooks', () => ({
  useUserIdentity: jest.fn().mockReturnValue({
    isLoading: false,
    data: {
      totalCount: 1,
      items: [
        {
          tenantId: null,
          userName: 'admin',
          name: 'admin',
          surname: null,
          email: 'admin@abp.io',
          emailConfirmed: false,
          phoneNumber: null,
          phoneNumberConfirmed: false,
          isActive: true,
          lockoutEnabled: true,
          lockoutEnd: null,
          concurrencyStamp: 'd4d233a94eb54d2da495832e1f8e7c74',
          isDeleted: false,
          deleterId: null,
          deletionTime: null,
          lastModificationTime: '2022-07-28T02:38:42.821371Z',
          lastModifierId: null,
          creationTime: '2022-07-18T09:04:44.590654Z',
          creatorId: null,
          id: '3a0522ba-55ac-e721-2020-8c24bc3e1856',
          extraProperties: {},
        },
      ],
    },
  }),
}));

test('Request My Requests Page', () => {
  const queryClient: QueryClient = new QueryClient();
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Router>
          <UserManagement />
        </Router>
      </RecoilRoot>
    </QueryClientProvider>
  );
  expect(container).toMatchSnapshot();
});
