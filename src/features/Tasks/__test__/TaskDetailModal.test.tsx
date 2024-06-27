import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskDetailModal } from '../components/TaskDetailModal';

jest.mock('../../../api/apiHooks/index', () => ({
  useAxios: jest.fn(),
}));

jest.mock('../../../api/axiosInstant', () => ({
  VITE_API_BASE_URL: '/api',
}));

//jest.mock('common/components/WorkflowModal', () => ({
//  VITE_PROXY_SERVER_URL: 'http://localhost:4433'
//}));

jest.mock('hooks/useIsAdmin', () => ({
  useIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock('api/apiHooks/requestHooks', () => ({
  useUserList: jest.fn().mockReturnValue({
    data: [
      {
        name: 'Ân Bùi Hoàng',
        email: 'an.buihoang@ncc.asia',
      },
    ],
  }),
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
  useApproveTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),

  useRejectTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),
  useGetAllTask: jest.fn().mockReturnValue({
    refetch: jest.fn(),
    isLoading: false,
    data: [
      {
        id: '3a13698e-ca9b-3c6e-c887-017fe5642cde',
        workflowInstanceId: '3a13698d-cd73-50a7-ed5e-bfc09b51dfd7',
        workflowDefinitionId: '3a0e34b2-9746-6a31-4bbc-e879f2c7ea99',
        email: null,
        status: 2,
        name: 'Probationary Confirmation Request',
        description: 'PM Reviews',
        dynamicActionData:
          '[{"name":"StrengthPoints","type":"RichText","isRequired":true,"data":""},{"name":"WeaknessPoints","type":"RichText","isRequired":true,"data":""}]',
        reason: 'a',
        creationTime: '2024-06-27T01:49:15.292285Z',
        otherActionSignals: null,
        emailTo: ['thien.dang@ncc.asia'],
        author: '3a0675ff-ebd0-71e9-b15c-b63d4f58cc79',
        authorName: 'Thien Dang An',
        updatedBy: null,
      },
      {
        id: '3a13657c-a2f3-5908-6f7f-98b5fe55ccd9',
        workflowInstanceId: '3a13657b-a5cd-ce20-f50f-c340b2258fd8',
        workflowDefinitionId: '3a0e34b2-9746-6a31-4bbc-e879f2c7ea99',
        email: null,
        status: 2,
        name: 'Probationary Confirmation Request',
        description: 'PM Reviews',
        dynamicActionData:
          '[{"name":"StrengthPoints","type":"RichText","isRequired":true,"data":""},{"name":"WeaknessPoints","type":"RichText","isRequired":true,"data":""}]',
        reason: 'á',
        creationTime: '2024-06-26T06:50:56.627515Z',
        otherActionSignals: null,
        emailTo: ['thien.dang@ncc.asia'],
        author: '3a0675ff-ebd0-71e9-b15c-b63d4f58cc79',
        authorName: 'Thien Dang An',
        updatedBy: null,
      },
    ],
  }),

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
        taskId="3a0d3d06-ffbb-0487-b6e4-9b3488ecec70"
        otherTasks={undefined}
      />
    </QueryClientProvider>
  );
  expect(baseElement).toMatchSnapshot();
});
