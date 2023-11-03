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
  VITE_PROXY_SERVER_URL: 'http://localhost:4433',
}));

jest.mock('hooks/useCurrentUser', () => ({
  useCurrentUser: jest.fn().mockReturnValue({ email: 'bob@example.com' }),
}));

jest.mock('../../../api/apiHooks/requestHooks', () => ({
  useRequestTemplates: () => ({
    data: {
      totalCount: 6,
      items: [
          {
            "definitionId": "3a05daee-8f55-1e4c-9ac3-443c04309b77",
            "name": "Change Office Request",
            "displayName": "Change Office Request",
            "description": null,
            "version": 19,
            "isSingleton": false,
            "isPublished": true,
            "isLatest": true,
            "inputDefinition": {
                "workflowDefinitionId": "3a05daee-8f55-1e4c-9ac3-443c04309b77",
                "propertyDefinitions": [
                    {
                        "name": "CurrentOffice",
                        "type": "OfficeList",
                        "isRequired": true
                    },
                    {
                        "name": "DestinationOffice",
                        "type": "OfficeList",
                        "isRequired": true
                    },
                    {
                        "name": "Content",
                        "type": "RichText",
                        "isRequired": true
                    },
                    {
                        "name": "StartDate",
                        "type": "DateTime",
                        "isRequired": true
                    },
                    {
                        "name": "EndDate",
                        "type": "DateTime",
                        "isRequired": false
                    }
                ],
                "id": "3a05ffba-3830-e0d4-e931-9381c70a3710"
            },
            "settingDefinition": {
                "workflowDefinitionId": "3a05daee-8f55-1e4c-9ac3-443c04309b77",
                "propertyDefinitions": {
                    "color": "#f27024"
                },
                "id": "00000000-0000-0000-0000-000000000000"
            },
            "id": "3a0e9592-318d-ecda-afd1-df7e05246cf4"
        },
        {
            "definitionId": "3a057e11-7cde-1749-5c03-60520662a1f5",
            "name": "Device Request",
            "displayName": "Device Request",
            "description": null,
            "version": 37,
            "isSingleton": false,
            "isPublished": true,
            "isLatest": true,
            "inputDefinition": {
                "workflowDefinitionId": "3a057e11-7cde-1749-5c03-60520662a1f5",
                "propertyDefinitions": [
                    {
                        "name": "CurrentOffice",
                        "type": "OfficeList",
                        "isRequired": true
                    },
                    {
                        "name": "Project",
                        "type": "MyProject",
                        "isRequired": true
                    },
                    {
                        "name": "Device",
                        "type": "Text",
                        "isRequired": true
                    },
                    {
                        "name": "Reason",
                        "type": "RichText",
                        "isRequired": true
                    }
                ],
                "id": "3a057e11-efb1-941c-e984-d72e30aa520c"
            },
            "settingDefinition": {
                "workflowDefinitionId": "3a057e11-7cde-1749-5c03-60520662a1f5",
                "propertyDefinitions": {
                    "color": "#f27024"
                },
                "id": "00000000-0000-0000-0000-000000000000"
            },
            "id": "3a0e5cd3-2bbe-35d0-8a00-fd929e53acf2"
        },
        {
            "definitionId": "3a0b89d4-93b5-232f-964d-ffa129064cc6",
            "name": "Office Equipment Request",
            "displayName": "Office Equipment Request",
            "description": null,
            "version": 11,
            "isSingleton": false,
            "isPublished": true,
            "isLatest": true,
            "inputDefinition": {
                "workflowDefinitionId": "3a0b89d4-93b5-232f-964d-ffa129064cc6",
                "propertyDefinitions": [
                    {
                        "name": "CurrentOffice",
                        "type": "OfficeList",
                        "isRequired": true
                    },
                    {
                        "name": "Equipment",
                        "type": "Text",
                        "isRequired": true
                    },
                    {
                        "name": "Reason",
                        "type": "RichText",
                        "isRequired": true
                    }
                ],
                "id": "3a0b89d7-218a-08db-93d8-e0d5979b3ff0"
            },
            "settingDefinition": {
                "workflowDefinitionId": "3a0b89d4-93b5-232f-964d-ffa129064cc6",
                "propertyDefinitions": {
                    "color": "#f27024"
                },
                "id": "00000000-0000-0000-0000-000000000000"
            },
            "id": "3a0e25da-1825-3ed5-6774-b172eb1a4e64"
        },
        {
            "definitionId": "3a0e486c-ffc1-b160-6a8a-27b169da00f6",
            "name": "Probationary Confirmation Request",
            "displayName": "Probationary Confirmation Request",
            "description": null,
            "version": 9,
            "isSingleton": false,
            "isPublished": true,
            "isLatest": true,
            "inputDefinition": {
                "workflowDefinitionId": "3a0e486c-ffc1-b160-6a8a-27b169da00f6",
                "propertyDefinitions": [
                    {
                        "name": "CurrentOffice",
                        "type": "OfficeList",
                        "isRequired": true
                    },
                    {
                        "name": "Staff",
                        "type": "UserList",
                        "isRequired": true
                    },
                    {
                        "name": "Content",
                        "type": "RichText",
                        "isRequired": true
                    },
                    {
                        "name": "StartDate",
                        "type": "DateTime",
                        "isRequired": true
                    },
                    {
                        "name": "EndDate",
                        "type": "DateTime",
                        "isRequired": true
                    }
                ],
                "id": "3a0e4871-d349-f5dd-9c22-1b1998745b27"
            },
            "settingDefinition": {
                "workflowDefinitionId": "3a0e486c-ffc1-b160-6a8a-27b169da00f6",
                "propertyDefinitions": {
                    "color": "#f27024"
                },
                "id": "00000000-0000-0000-0000-000000000000"
            },
            "id": "3a0e7c3d-8ea9-0d71-6dfe-cf0db12edb87"
        },
        {
            "definitionId": "3a0e0b0b-eb79-7124-53af-05734fe921f4",
            "name": "tesst",
            "displayName": "huyhuy",
            "description": null,
            "version": 1,
            "isSingleton": false,
            "isPublished": true,
            "isLatest": true,
            "inputDefinition": {
                "workflowDefinitionId": "3a0e0b0b-eb79-7124-53af-05734fe921f4",
                "propertyDefinitions": [
                    {
                        "name": "tem",
                        "type": "Text",
                        "isRequired": false
                    },
                    {
                        "name": "jkkk",
                        "type": "Text",
                        "isRequired": true
                    }
                ],
                "id": "3a0e959c-03d7-e768-43d6-a61ad5f822ab"
            },
            "settingDefinition": null,
            "id": "3a0e0b0b-eb79-e64b-5680-72270122cd54"
        },
        {
            "definitionId": "3a0da6a6-c212-60b6-a952-3efed4c97d1a",
            "name": "WFH Request",
            "displayName": "WFH Request",
            "description": null,
            "version": 22,
            "isSingleton": false,
            "isPublished": true,
            "isLatest": true,
            "inputDefinition": {
                "workflowDefinitionId": "3a0da6a6-c212-60b6-a952-3efed4c97d1a",
                "propertyDefinitions": [
                    {
                        "name": "CurrentOffice",
                        "type": "OfficeList",
                        "isRequired": true
                    },
                    {
                        "name": "Project",
                        "type": "MyProject",
                        "isRequired": true
                    },
                    {
                        "name": "Reason",
                        "type": "RichText",
                        "isRequired": true
                    },
                    {
                        "name": "Dates",
                        "type": "MultiDatetime",
                        "isRequired": true
                    }
                ],
                "id": "3a0da6a8-c89f-080d-eabb-e892d2b91959"
            },
            "settingDefinition": {
                "workflowDefinitionId": "3a0da6a6-c212-60b6-a952-3efed4c97d1a",
                "propertyDefinitions": {
                    "color": "#f27024"
                },
                "id": "00000000-0000-0000-0000-000000000000"
            },
            "id": "3a0e0baf-3c31-c6a8-1f6d-ffe8d278d7ad"
        }
      ]
    }
  })
}))

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

jest.mock('hooks/useMediaQuery', () => ({
  useMediaQuery: jest.fn().mockReturnValue(true),
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
