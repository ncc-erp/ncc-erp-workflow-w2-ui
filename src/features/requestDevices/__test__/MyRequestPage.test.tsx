import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyRequests from '..';
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
  VITE_PROXY_SERVER_URL: 'http://localhost:4433',
}));

jest.mock('api/apiHooks/requestHooks', () => ({
  useMyRequests: jest.fn().mockReturnValue({
    isLoading: false,
    data: {
      totalCount: 2,
      items: [
        {
          id: '3a0e24f1-b739-1627-f78a-cb2bdd068279',
          workflowDefinitionId: '3a0b89d4-93b5-232f-964d-ffa129064cc6',
          workflowDefinitionDisplayName: 'Office Equipment Request',
          userRequestName: 'Nhan Huynh Ba',
          createdAt: '2023-10-09T04:49:34.009027Z',
          lastExecutedAt: '2023-10-09T04:49:38.214996Z',
          status: 'Pending',
          stakeHolders: ['Nhan Huynh Ba'],
          currentStates: ['Branch Manager makes decision'],
          creatorId: null,
        },
        {
          id: '3a0e24d9-7768-89cf-6ad3-9003fd4ac3ae',
          workflowDefinitionId: '3a059dc6-a381-3cc5-b6ff-7a6559d1adf7',
          workflowDefinitionDisplayName: 'WFH Request',
          userRequestName: 'Nhan Huynh Ba',
          createdAt: '2023-10-09T04:23:04.808603Z',
          lastExecutedAt: '2023-10-09T04:25:10.325766Z',
          status: 'Rejected',
          stakeHolders: [],
          currentStates: [],
          creatorId: null,
        },
      ],
    },
  }),
  useRequestTemplates: jest.fn().mockReturnValue({
    data: {
      totalCount: 2,
      items: [
        {
          definitionId: '3a0b89d4-93b5-232f-964d-ffa129064cc6',
          name: 'Office Equipment Request',
          displayName: 'Office Equipment Request',
          description: null,
          version: 26,
          isSingleton: false,
          isPublished: true,
          isLatest: true,
          inputDefinition: {
            workflowDefinitionId: '3a0b89d4-93b5-232f-964d-ffa129064cc6',
            propertyDefinitions: [
              {
                name: 'CurrentOffice',
                type: 'OfficeList',
                isRequired: true,
              },
              {
                name: 'Equipment',
                type: 'Text',
                isRequired: true,
              },
              {
                name: 'Reason',
                type: 'RichText',
                isRequired: true,
              },
            ],
            id: '3a0b89d7-218a-08db-93d8-e0d5979b3ff0',
          },
          id: '3a0e258e-7205-9a8b-d793-61e592dc6f4e',
        },
        {
          definitionId: '3a059dc6-a381-3cc5-b6ff-7a6559d1adf7',
          name: 'WFH Request',
          displayName: 'WFH Request',
          description: null,
          version: 25,
          isSingleton: false,
          isPublished: true,
          isLatest: true,
          inputDefinition: {
            workflowDefinitionId: '3a059dc6-a381-3cc5-b6ff-7a6559d1adf7',
            propertyDefinitions: [
              {
                name: 'CurrentOffice',
                type: 'OfficeList',
                isRequired: true,
              },
              {
                name: 'Project',
                type: 'MyProject',
                isRequired: true,
              },
              {
                name: 'Reason',
                type: 'RichText',
                isRequired: true,
              },
              {
                name: 'Dates',
                type: 'MultiDatetime',
                isRequired: true,
              },
            ],
            id: '3a05bbcd-9728-0c18-2bb1-1dfa77590b25',
          },
          id: '3a0e2991-3a4c-68fa-66aa-8dfd7baf6767',
        },
      ],
    },
  }),
  useDeleteRequest: jest.fn(),
  useCancelRequest: jest.fn(),
}));

test('Request My Requests Page', () => {
  const queryClient: QueryClient = new QueryClient();
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <MyRequests />
      </RecoilRoot>
    </QueryClientProvider>
  );
  expect(container).toMatchSnapshot();
});
