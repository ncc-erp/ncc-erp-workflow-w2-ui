import { screen, render } from '@testing-library/react';
import Login from '../pages/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../api/axiosInstant', () => ({
  VITE_API_BASE_URL: '/api',
}));

jest.mock('../../../services/authService', () => ({
  VITE_AUTHORITY_URL: '/api',
  VITE_OAUTH_CLIENT_ID:
    '797442917082-hihd7e20h4bef4oh0fbr7b8lml27ki7n.apps.googleusercontent.com',
  VITE_GOOGLE_LOGIN_REDIRECT: 'http://localhost:4200',
}));

jest.mock('../../../api/axiosInstant', () => ({
  useAxios: jest.fn(),
}));

describe('Login Page', () => {
  let queryClient: QueryClient;
  beforeAll(() => {
    queryClient = new QueryClient();
  });

  test('Check Display form Log in', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
    );
    const form = screen.getByTestId('login-form');
    expect(form).toBeInTheDocument();
  });
});
