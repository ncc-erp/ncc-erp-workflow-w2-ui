import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskDetailModal } from '../components/TaskDetailModal';

jest.mock('../../../api/apiHooks/index', () => ({
  useAxios: jest.fn(),
}));

jest.mock('../../../api/axiosInstant', () => ({
  VITE_API_BASE_URL: '/api',
}));

jest.mock('common/components/WorkflowModal', () => ({
  VITE_PROXY_SERVER_URL: 'http://localhost:4433',
}));

jest.mock('hooks/useIsAdmin', () => ({
  useIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock('api/apiHooks/requestHooks', () => ({
  useOffices: jest.fn().mockReturnValue({
    data: [
      {
        displayName: 'Đà Nẵng',
        code: 'ĐN',
        headOfOfficeEmail: 'thien.dang@ncc.asia',
      },
    ],
  }),
}));

jest.mock('api/apiHooks/taskHooks', () => ({
  useActionTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),
  useGetTaskDetail: jest.fn().mockReturnValue({
    refetch: jest.fn(),
    isLoading: false,
    data: {
      tasks: {
        id: '3a0e2af0-769c-6fa4-ccab-90ca0afe6861',
        workflowInstanceId: '3a0e2af0-73ad-ff31-9f9c-6f5d347d48ec',
        workflowDefinitionId: '3a0e256f-a848-065c-fab4-56e8c133918b',
        email: null,
        status: 0,
        name: 'Probationary Request',
        description: 'PM Reviews',
        dynamicActionData:
          '[{"name":"StrengthPoints","type":"RichText","isRequired":true,"data":""},{"name":"WeaknessPoints","type":"RichText","isRequired":true,"data":""}]',
        reason: null,
        creationTime: '2023-10-10T08:45:55.228848Z',
        otherActionSignals: [],
        emailTo: null,
        author: '3a0d3d06-ffbb-0487-b6e4-9b3488ecec70',
        authorName: null,
      },
      emailTo: ['long.vodinhhoang@ncc.asia', 'trang.danghuyen@ncc.asia'],
      otherActionSignals: null,
      input: {
        Request: {
          content: 'sdasda',
          currentOffice: {
            displayName: 'Đà Nẵng',
            code: 'ĐN',
            headOfOfficeEmail: 'thien.dang@ncc.asia',
          },
          startDate: '04/10/2023',
          endDate: '01/02/2024',
        },
        RequestUser: {
          email: 'long.vodinhhoang@ncc.asia',
          name: 'Long Vo Dinh Hoang',
          project: null,
          pm: 'thien.dang@ncc.asia',
          headOfOfficeEmail: 'thien.dang@ncc.asia',
          projectCode: 'ncc-w2',
          branchName: 'Đà Nẵng',
          branchCode: 'ĐN',
          id: '3a0d3d06-ffbb-0487-b6e4-9b3488ecec70',
        },
      },
    },
  }),
}));

test('Task Detail Modal', () => {
  const queryClient: QueryClient = new QueryClient();
  const { baseElement } = render(
    <QueryClientProvider client={queryClient}>
      <TaskDetailModal
        isOpen={true}
        onClose={() => jest.fn()}
        taskId="abcxyz"
      />
    </QueryClientProvider>
  );
  expect(baseElement).toMatchSnapshot();
});
