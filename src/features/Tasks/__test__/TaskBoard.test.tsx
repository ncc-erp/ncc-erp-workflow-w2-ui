import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import Tasks from '..';
// import userEvent from '@testing-library/user-event';

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

jest.mock('hooks/useMediaQuery', () => ({
  useMediaQuery: jest.fn().mockReturnValue(true),
}));

jest.mock('hooks/useCurrentUser', () => ({
  useCurrentUser: jest.fn().mockReturnValue({ email: 'bob@example.com' }),
}));

jest.mock('utils/subtractTime.ts', () => ({
  subtractTime: jest.fn().mockReturnValue('15/9/2023'),
}));



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

jest.mock('api/apiHooks/requestHooks', () => ({
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

describe('Task Page', () => {
  test("should match snapshot when rendering'", () => {
    const queryClient: QueryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <Tasks />
        </Router>
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  })

  describe("should behave as expected when total is 3 items", () => {
    const queryClient: QueryClient = new QueryClient();
    beforeEach(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <Router>
            <Tasks />
          </Router>
        </QueryClientProvider>
      )
    });

    it("should display the title 'Tasks Board'" , () => {
      expect(
        screen.getByRole('heading', {level:1, name:"Tasks Board"})
      ).toBeInTheDocument();
    });

    it('should display the correct three number of selects on the screen', async () => {
      const selectList = await screen.findAllByRole('combobox');
      expect(selectList).toHaveLength(3);
    });

    it('should display the search email', async () => {
      await screen.findByPlaceholderText('Enter email');
    });

    it('should display the correct number of buttons on the screen', async () => {
      const buttonList = await screen.findAllByRole('button');
      expect(buttonList).toHaveLength(7);
    });

    it("should match color of type 'Request Template'", async () => {
      const element = await screen.findByText("Probationary Request");
      const computedStyle = window.getComputedStyle(element);
    
      const backgroundColor = computedStyle.backgroundColor;
    
      expect(backgroundColor).toBe("rgb(51, 102, 204)");
    });
  })  
});
