import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RequestDetailModal } from '../components/DetailModal';
import { RequestStatus } from 'common/enums';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        // Thêm các key đúng như trong HTML output
        'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.OFFICE_EQUIPMENT':
          'Office Equipment Request',
        'MY_REQUESTS_PAGE.TITLES.REQUEST_DETAILS': 'Request Details',
        'MY_REQUESTS_PAGE.BUTTONS.VIEW_WORKFLOW': 'View Workflow Detail',
        'MY_REQUESTS_PAGE.LABELS.REQUEST_INPUT': 'Request input',
        'MY_REQUESTS_PAGE.LABELS.REQUEST_USER': 'Request user',
        'MY_REQUESTS_PAGE.LABELS.NAME': 'Name',
        'MY_REQUESTS_PAGE.LABELS.EMAIL': 'Email',
        'MY_REQUESTS_PAGE.LABELS.BRANCH_NAME': 'Branch name',
        'MY_REQUESTS_PAGE.LABELS.DETAIL': 'Detail',
        'MY_REQUESTS_PAGE.LABELS.REQUEST_TEMPLATE': 'Request template',
        'MY_REQUESTS_PAGE.LABELS.STATUS': 'Status',
        'MY_REQUESTS_PAGE.REQUEST_STATUS.APPROVED': 'Approved',
        'MY_REQUESTS_PAGE.LABELS.CURRENT_STATE': 'Current state',
        'MY_REQUESTS_PAGE.LABELS.STAKEHOLDERS': 'Stakeholders',
        'MY_REQUESTS_PAGE.LABELS.CREATION_TIME': 'Creation time',
        'MY_REQUESTS_PAGE.LABELS.CURRENT_OFFICE': 'Current Office',
        'MY_REQUESTS_PAGE.LABELS.EQUIPMENT': 'Equipment',
        'MY_REQUESTS_PAGE.LABELS.REASON': 'Reason',

        // Giữ lại các key cũ để backward compatibility
        'common.requestTemplates.officeEquipment': 'Office Equipment Request',
        'myRequests.titles.requestDetails': 'Request Details',
        'myRequests.buttons.viewWorkflow': 'View Workflow Detail',
        'myRequests.labels.requestInput': 'Request input',
        'myRequests.labels.requestUser': 'Request user',
        'myRequests.labels.name': 'Name',
        'myRequests.labels.email': 'Email',
        'myRequests.labels.branchName': 'Branch name',
        'myRequests.labels.detail': 'Detail',
        'myRequests.labels.requestTemplate': 'Request template',
        'myRequests.labels.status': 'Status',
        'common.requestStatus.approved': 'Approved',
        'myRequests.labels.currentState': 'Current state',
        'myRequests.labels.stakeholders': 'Stakeholders',
        'myRequests.labels.creationTime': 'Creation time',
      };
      return translations[key] || key;
    },
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

jest.mock('../../../api/apiHooks/index', () => ({
  useAxios: jest.fn(),
}));

jest.mock('../../../api/axiosInstant', () => ({
  VITE_API_BASE_URL: '/api',
}));

jest.mock('common/components/WorkflowModal', () => ({
  VITE_PROXY_SERVER_URL: 'http://localhost:4433',
}));

jest.mock('api/apiHooks/requestHooks', () => ({
  useGetRequestDetail: jest.fn().mockReturnValue({
    isLoading: false,
    data: {
      typeRequest: 'Office Equipment Request',
      input: {
        Request: {
          CurrentOffice: 'ĐN',
          Equipment: 'test current state',
          Reason: 'test',
        },
        EmailTemplate:
          '\n<style>\n    p {\n        margin: 0;\n    }\n</style>\n<div style="margin: 13px 0">\n    <b>Văn phòng đang làm việc</b>: Đà Nẵng\n</div>\n<div style="margin: 13px 0">\n    <b>Thiết bị cần request</b>: test current state\n</div>\n<div style="display: flex; margin: 13px 0;">\n    <b>Lý do:</b>&#160;test\n</div>\n',
        RequestUser: {
          email: 'nhan.huynhba@ncc.asia',
          name: 'Nhan Huynh Ba',
          project: null,
          pm: 'thien.dang@ncc.asia',
          headOfOfficeEmail: 'thien.dang@ncc.asia',
          projectCode: 'asm',
          branchName: 'Đà Nẵng',
          branchCode: 'ĐN',
          id: '3a0d3270-71a8-69d7-265b-ed35f5cc9960',
        },
      },
      workInstanceId: '3a0e24f1-b739-1627-f78a-cb2bdd068279',
      tasks: [
        {
          id: '3a0e24f1-b9a4-732f-65f2-836b6d9b6af9',
          workflowInstanceId: '3a0e24f1-b739-1627-f78a-cb2bdd068279',
          workflowDefinitionId: '3a0b89d4-93b5-232f-964d-ffa129064cc6',
          email: null,
          status: 0,
          name: 'Office Equipment Request',
          description: 'Branch Manager Makes Decision',
          dynamicActionData: null,
          reason: null,
          creationTime: '2023-10-09T04:49:34.630211Z',
          otherActionSignals: [],
          emailTo: null,
          author: '3a0d3270-71a8-69d7-265b-ed35f5cc9960',
          authorName: null,
        },
      ],
    },
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
  useUserList: jest.fn().mockReturnValue({
    data: [
      {
        name: 'Ân Bùi Hoàng',
        email: 'an.buihoang@ncc.asia',
      },
    ],
  }),
}));

const requestDetails = {
  id: '3a0e24f1-b739-1627-f78a-cb2bdd068279',
  workflowDefinitionId: '3a0b89d4-93b5-232f-964d-ffa129064cc6',
  workflowDefinitionDisplayName: 'Office Equipment Request',
  userRequestName: 'Nhan Huynh Ba',
  createdAt: '2023-10-09T04:49:34.009027Z',
  lastExecutedAt: '2023-10-09T04:49:38.214996Z',
  status: RequestStatus.Approved,
  stakeHolders: ['Nhan Huynh Ba'],
  currentStates: ['Branch Manager makes decision'],
};

describe('My Request Detail', () => {
  const queryClient: QueryClient = new QueryClient();

  test('should match snapshot when rendering', async () => {
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <RequestDetailModal
          isOpen={true}
          onClose={() => jest.fn()}
          requestDetail={requestDetails}
        />
      </QueryClientProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  describe('My Request Detail with requestDetails', () => {
    beforeEach(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <RequestDetailModal
            isOpen={true}
            onClose={() => jest.fn()}
            requestDetail={requestDetails}
          />
        </QueryClientProvider>
      );
    });

    it('Should have a Title when Request Detail loaded.', () => {
      expect(screen.getAllByText(/Office Equipment Request/i)).toBeTruthy();
    });

    describe('Request input attributes', () => {
      it('Should have a Request input attributes when Request Detail loaded.', async () => {
        screen.findByText(/Request input/i);
      });

      it('Should have a Current Office label in Request input', () => {
        screen.findByLabelText(/Current Office/i);
      });

      it('Should have a Reason label in Request input', () => {
        screen.findByLabelText(/Reason/i);
      });

      it('Should have a Equipment label in Request input', () => {
        screen.findByLabelText(/Equipment/i);
      });
    });

    describe('Request user attributes', () => {
      it('Should have a Request user attributes when Request Detail loaded.', async () => {
        screen.findByText(/Request user/i);
      });

      it('Should have a Name label in Request user', () => {
        screen.findByLabelText(/Name/i);
      });

      it('Should have a Email label in Request user', () => {
        screen.findByLabelText(/Email/i);
      });

      it('Should have a Branch name label in Request user', () => {
        screen.findByLabelText(/Branch name/i);
      });
    });

    describe('Detail attributes', () => {
      it('Should have a Detail attributes when Request Detail loaded.', async () => {
        screen.findByText(/Detail attributes/i);
      });

      it('Should have a Request template label in Detail', () => {
        screen.findByLabelText(/Request template/i);
      });

      it('Should have a Status label in Detail', () => {
        screen.findByLabelText(/Status/i);
      });

      it('Should have a Current state label in Detail', () => {
        screen.findByLabelText(/Current state/i);
      });

      it('Should have a Stakeholders label in Detail', () => {
        screen.findByLabelText(/Stakeholders/i);
      });

      it('Should have a Creation time label in Detail', () => {
        screen.findByLabelText(/Creation time/i);
      });
    });
  });
});
