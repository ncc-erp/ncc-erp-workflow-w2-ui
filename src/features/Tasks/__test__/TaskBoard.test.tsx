import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import Tasks from '..';

jest.useFakeTimers().setSystemTime(new Date('2023-12-11'));

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

jest.mock('stores/user', () => ({
  useCurrentUser: jest.fn().mockReturnValue({ email: 'bob@example.com' }),
}));

jest.mock('utils/subtractTime.ts', () => ({
  subtractTime: jest.fn().mockReturnValue('15/9/2023'),
}));

jest.mock('common/constants.ts', () => {
  const actualConstants = jest.requireActual('common/constants.ts');
  return {
    ...actualConstants,
    FilterDate: {
      W1: '1 week',
    },
  };
});

jest.mock('api/apiHooks/requestHooks', () => ({
  useRequestTemplates: jest.fn().mockReturnValue({
    isLoading: false,
    data: {
      totalCount: 1,
      items: [
        {
          definitionId: '3a05daee-8f55-1e4c-9ac3-443c04309b77',
          name: 'Change Office Request',
          displayName: 'Change Office Request',
          description: null,
          version: 15,
          isSingleton: false,
          isPublished: true,
          isLatest: true,
          inputDefinition: {
            workflowDefinitionId: '3a05daee-8f55-1e4c-9ac3-443c04309b77',
            propertyDefinitions: [
              {
                name: 'CurrentOffice',
                type: 'OfficeList',
                isRequired: true,
              },
              {
                name: 'DestinationOffice',
                type: 'OfficeList',
                isRequired: true,
              },
              {
                name: 'Content',
                type: 'RichText',
                isRequired: true,
              },
              {
                name: 'StartDate',
                type: 'DateTime',
                isRequired: true,
              },
              {
                name: 'EndDate',
                type: 'DateTime',
                isRequired: false,
              },
            ],
            id: '3a05ffba-3830-e0d4-e931-9381c70a3710',
          },
          id: '3a0e24fb-ebd4-bd23-f2a9-7e447230098e',
        },
      ],
    },
  }),
}));

jest.mock('api/apiHooks/taskHooks', () => ({
  useGetAllTask: jest
    .fn()
    .mockReturnValue({
      isLoading: false,
      data: {
        totalCount: 1,
        items: [
          {
            id: '3a0e2b22-fcfd-82fb-cb31-fff19f66387f',
            workflowInstanceId: '3a0e2b21-6ea7-959e-fe4c-e5954ead2832',
            workflowDefinitionId: '3a0e256f-a848-065c-fab4-56e8c133918b',
            email: null,
            status: 2,
            name: 'Probationary Request',
            description: 'CEO Review',
            dynamicActionData: null,
            reason: 'test reject',
            creationTime: '2023-10-10T09:41:06.430178Z',
            otherActionSignals: null,
            emailTo: ['nhan.huynhba@ncc.asia'],
            author: '3a0daa05-f851-d09a-9361-8896cc20637b',
            authorName: 'Ba Bi',
          },
        ],
      },
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    })
    .mockReturnValueOnce({
      isLoading: false,
      data: {
        totalCount: 1,
        items: [
          {
            id: '3a0e2b27-294b-7199-3321-bb163038125b',
            workflowInstanceId: '3a0e2b26-0fd1-c3f1-2a8d-e6060cbdb3bc',
            workflowDefinitionId: '3a0e256f-a848-065c-fab4-56e8c133918b',
            email: null,
            status: 0,
            name: 'Probationary Request',
            description: 'CEO Review',
            dynamicActionData: null,
            reason: null,
            creationTime: '2023-10-10T09:45:39.916149Z',
            otherActionSignals: null,
            emailTo: ['nhan.huynhba@ncc.asia'],
            author: '3a0daa05-f851-d09a-9361-8896cc20637b',
            authorName: 'Be Be Bong Bong',
          },
        ],
      },
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    })
    .mockReturnValueOnce({
      isLoading: false,
      data: {
        totalCount: 1,
        items: [
          {
            id: '3a0e2ae2-6743-7ed8-6739-7ae048129083',
            workflowInstanceId: '3a0e2ae1-4f0f-2cef-38fb-68bcac65555e',
            workflowDefinitionId: '3a0e256f-a848-065c-fab4-56e8c133918b',
            email: null,
            status: 1,
            name: 'Probationary Request',
            description: 'CEO Review',
            dynamicActionData: null,
            reason: null,
            creationTime: '2023-10-10T08:30:33.795567Z',
            otherActionSignals: null,
            emailTo: ['nhan.huynhba@ncc.asia'],
            author: '3a0d3d06-ffbb-0487-b6e4-9b3488ecec70',
            authorName: 'Thai Long',
          },
        ],
      },
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    }),

  useActionTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),

  useApproveTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),

  useDynamicDataTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),

  useRejectTask: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),
}));

jest.mock('utils/getAllTaskPagination', () => ({
  getAllTaskPagination: jest
    .fn()
    .mockReturnValue({
      totalCount: 1,
      items: [
        {
          id: '3a0e2b22-fcfd-82fb-cb31-fff19f66387f',
          workflowInstanceId: '3a0e2b21-6ea7-959e-fe4c-e5954ead2832',
          workflowDefinitionId: '3a0e256f-a848-065c-fab4-56e8c133918b',
          email: null,
          status: 2,
          name: 'Probationary Request',
          description: 'CEO Review',
          dynamicActionData: null,
          reason: 'test reject',
          creationTime: '2023-10-10T09:41:06.430178Z',
          otherActionSignals: null,
          emailTo: ['nhan.huynhba@ncc.asia'],
          author: '3a0daa05-f851-d09a-9361-8896cc20637b',
          authorName: 'Ba Bi',
        },
      ],
    })
    .mockReturnValueOnce({
      totalCount: 1,
      items: [
        {
          id: '3a0e2b27-294b-7199-3321-bb163038125b',
          workflowInstanceId: '3a0e2b26-0fd1-c3f1-2a8d-e6060cbdb3bc',
          workflowDefinitionId: '3a0e256f-a848-065c-fab4-56e8c133918b',
          email: null,
          status: 0,
          name: 'Probationary Request',
          description: 'CEO Review',
          dynamicActionData: null,
          reason: null,
          creationTime: '2023-10-10T09:45:39.916149Z',
          otherActionSignals: null,
          emailTo: ['nhan.huynhba@ncc.asia'],
          author: '3a0daa05-f851-d09a-9361-8896cc20637b',
          authorName: 'Be Be Bong Bong',
        },
      ],
    })
    .mockReturnValueOnce({
      totalCount: 1,
      items: [
        {
          id: '3a0e2ae2-6743-7ed8-6739-7ae048129083',
          workflowInstanceId: '3a0e2ae1-4f0f-2cef-38fb-68bcac65555e',
          workflowDefinitionId: '3a0e256f-a848-065c-fab4-56e8c133918b',
          email: null,
          status: 1,
          name: 'Probationary Request',
          description: 'CEO Review',
          dynamicActionData: null,
          reason: null,
          creationTime: '2023-10-10T08:30:33.795567Z',
          otherActionSignals: null,
          emailTo: ['nhan.huynhba@ncc.asia'],
          author: '3a0d3d06-ffbb-0487-b6e4-9b3488ecec70',
          authorName: 'Thai Long',
        },
      ],
    }),
}));

jest.mock('stores/user', () => ({
  __esModule: true,
  useCurrentUser: jest.fn().mockReturnValue({
    sub: [
      '81676b37-5ab2-469a-b04b-63aaedb34b40',
      '81676b37-5ab2-469a-b04b-63aaedb34b40',
    ],
    name: 'nhan.huynhba@ncc.asia',
    email: 'nhan.huynhba@ncc.asia',
    given_name: ['Nhan Huynh Ba', 'Nhan Huynh Ba'],
    role: 'admin',
    unique_name: 'nhan.huynhba@ncc.asia',
    auth_time: '1703748944',
    nbf: 1703748944,
    exp: 1703750744,
    iat: 1703748944,
    iss: 'W2',
    aud: 'W2',
  }),
}));

test('Request My Requests Page', () => {
  const queryClient: QueryClient = new QueryClient();

  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <Tasks />
      </Router>
    </QueryClientProvider>
  );
  expect(container).toMatchSnapshot();
});
