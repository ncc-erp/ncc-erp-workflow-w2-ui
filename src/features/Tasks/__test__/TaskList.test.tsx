import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListTask } from 'common/components/Boards/ListTask';
import { FilterTasks } from 'models/task';
import { RecoilRoot } from 'recoil';

jest.mock('../../../api/apiHooks/index', () => ({
  useAxios: jest.fn(),
}));

jest.mock('../../../api/axiosInstant', () => ({
  VITE_API_BASE_URL: '/api',
}));

jest.mock('hooks/useIsAdmin', () => ({
  useIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock('common/components/WorkflowModal', () => ({
  VITE_GOOGLE_LOGIN_REDIRECT: 'http://localhost:4200',
}));

jest.mock('hooks/useCurrentUser', () => ({
  useCurrentUser: jest.fn().mockReturnValue({ email: 'bob@example.com' }),
}));

jest.mock('api/apiHooks/taskHooks', () => ({
  useGetTasks: jest.fn().mockReturnValue({
    isLoading: false,
    isRefetching: false,
    refetch: jest.fn(),
    data: {
      totalCount: 1,
      items: [
        {
          id: '3a0e2b21-7143-224b-f17f-6d0ca4f7d274',
          workflowInstanceId: '3a0e2b21-6ea7-959e-fe4c-e5954ead2832',
          workflowDefinitionId: '3a0e256f-a848-065c-fab4-56e8c133918b',
          email: null,
          status: 1,
          name: 'Probationary Request',
          description: 'PM Reviews',
          dynamicActionData:
            '[{"name":"StrengthPoints","type":"RichText","isRequired":true,"data":""},{"name":"WeaknessPoints","type":"RichText","isRequired":true,"data":""}]',
          reason: null,
          creationTime: '2023-10-10T09:39:25.124704Z',
          otherActionSignals: null,
          emailTo: ['trang.danghuyen@ncc.asia', 'long.vodinhhoang@ncc.asia'],
          author: '3a0daa05-f851-d09a-9361-8896cc20637b',
          authorName: 'Bubu chacha',
        },
      ],
    },
  }),
  useActionTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),

  useApproveTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),

  useRejectTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),
}));

test('Request My Requests Page', () => {
  const filter: FilterTasks = {
    maxResultCount: 10,
    skipCount: 0,
  };
  const queryClient: QueryClient = new QueryClient();
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ListTask filters={filter} openDetailModal={() => jest.fn()} />
      </RecoilRoot>
    </QueryClientProvider>
  );
  expect(container).toMatchSnapshot();
});
