import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RequestForm from '../components/forms/RequestForm';
import { InputDefinition } from 'models/request';
import userEvent from '@testing-library/user-event';

jest.mock('../../../api/apiHooks/index', () => ({
  useAxios: jest.fn(),
}));

jest.mock('../../../api/axiosInstant', () => ({
  VITE_API_BASE_URL: '/api',
}));

jest.mock('api/apiHooks/requestHooks', () => ({
  useOffices: jest.fn().mockReturnValue({
    data: [
      {
        displayName: 'Đà Nẵng',
        code: 'ĐN',
        headOfOfficeEmail: 'thien.dang@ncc.asia',
      },
      {
        displayName: 'Vinh',
        code: 'V',
        headOfOfficeEmail: 'dai.trinhduc@ncc.asia',
      },
    ],
  }),
  useUserProjects: jest.fn().mockReturnValue({
    data: [
      {
        pm: [
          {
            fullName: 'Khanh Đoàn Công',
            emailAddress: 'khanh.doancong@ncc.asia',
          },
        ],
        code: 'dn-training-php-khanh',
        name: '[ĐN] Training PHP - Khanh',
      },
      {
        pm: [
          {
            fullName: 'Thiên Đặng An',
            emailAddress: 'thien.dang@ncc.asia',
          },
        ],
        code: 'asm',
        name: 'AMS',
      },
      {
        pm: [
          {
            fullName: 'Vân Nguyễn Hồng',
            emailAddress: 'van.nguyenhong@ncc.asia',
          },
          {
            fullName: 'Nhung Nguyễn Thị',
            emailAddress: 'nhung.nguyenthi@ncc.asia',
          },
          {
            fullName: 'Hiền Ngô Thu',
            emailAddress: 'hien.ngothu@ncc.asia',
          },
          {
            fullName: 'Anh Nguyễn Thị Phương',
            emailAddress: 'phuonganh.nguyen@ncc.asia',
          },
        ],
        code: 'nca',
        name: 'Company Activities',
      },
      {
        pm: [
          {
            fullName: 'Tiến Nguyễn Hữu',
            emailAddress: 'tien.nguyenhuu@ncc.asia',
          },
          {
            fullName: 'Trung Đỗ Đức',
            emailAddress: 'trung.doduc@ncc.asia',
          },
          {
            fullName: 'Hiếu Đỗ Hoàng',
            emailAddress: 'hieu.dohoang@ncc.asia',
          },
        ],
        code: 'support',
        name: 'Support',
      },
    ],
  }),
  useUserList: jest.fn().mockReturnValue({
    data: [
      {
        name: 'admin admin',
        email: 'admin@aspnetboilerplate.com',
      },
      {
        name: 'admin admin',
        email: 'admintytyyt@aspnetboilerplate.com',
      },
      {
        name: 'Ân Bùi Hoàng',
        email: 'an.buihoang@ncc.asia',
      },
    ],
  }),
  useUserInfoWithBranch: jest.fn().mockReturnValue({
    data: {
      fullName: 'Huỳnh Bá Nhân',
      email: 'nhan.huynhba@ncc.asia',
      branch: 'ĐN',
    },
  }),
  useUserCurrentProject: jest.fn().mockReturnValue({
    data: {
      pm: {
        fullName: 'Thiên Đặng An',
        emailAddress: 'thien.dang@ncc.asia',
      },
      code: 'asm',
      name: 'AMS',
    },
  }),
  useNewRequestWorkflow: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),
}));

const inputDefinition: InputDefinition = {
  workflowDefinitionId: '3a05daee-8f55-1e4c-9ac3-443c04309b77',
  propertyDefinitions: [
    {
      name: 'CurrentOffice',
      type: 'OfficeList',
      isRequired: true,
      isTitle: true,
    },
    {
      name: 'DestinationOffice',
      type: 'OfficeList',
      isRequired: true,
      isTitle: true,
    },
    {
      name: 'Content',
      type: 'RichText',
      isRequired: true,
      isTitle: true,
    },
    {
      name: 'StartDate',
      type: 'DateTime',
      isRequired: true,
      isTitle: true,
    },
    {
      name: 'EndDate',
      type: 'DateTime',
      isRequired: false,
      isTitle: true,
    },
  ],
  id: '3a05ffba-3830-e0d4-e931-9381c70a3710',
};

describe('Request Template Form Components', () => {
  const queryClient: QueryClient = new QueryClient();

  test('should match snapshot when rendering', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RequestForm
          inputDefinition={inputDefinition}
          onCloseModal={() => jest.fn()}
        />
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  describe('Request Form with inputDefinition', () => {
    beforeEach(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <RequestForm
            inputDefinition={inputDefinition}
            onCloseModal={() => jest.fn()}
          />
        </QueryClientProvider>
      );
    });

    describe('Content Input', () => {
      it('should have a Content input when the form is loaded', () => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      it('should show an error message when no content is entered', async () => {
        const submitButton = screen.getByRole('button', {
          name: 'Save',
        });
        userEvent.click(submitButton);
        const result = await screen.findByText(/Content is Required/i);
        expect(result).toBeInTheDocument();
      });
    });

    describe('Start Date Input', () => {
      it('should have a Start Date input when the form is loaded', () => {
        expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
      });

      it('should show an error message when no Start Date is entered', async () => {
        const submitButton = screen.getByRole('button', {
          name: 'Save',
        });
        userEvent.click(submitButton);
        const result = await screen.findByText(/Start Date is Required/i);
        expect(result).toBeInTheDocument();
      });
    });

    describe('End Date Input', () => {
      it('should have an End Date input when the form is loaded', () => {
        expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
      });
    });

    describe('When all options are chosen and submitted', () => {
      it('should submit the form with the selected values', async () => {
        userEvent.type(screen.getByText('Content'), 'Is the Content');
        // Select the start date
        const startPicker = screen.getByLabelText(/Start Date/i);
        userEvent.click(startPicker);
        const startDateToSelect = new Date(2023, 9, 18);
        const startDay = startDateToSelect.getDate();

        // Wait for the start date to appear and select it
        await waitFor(() =>
          userEvent.click(screen.getByText(startDay.toString()))
        );

        // Select the end date
        const endPicker = screen.getByLabelText(/End Date/i);
        userEvent.click(endPicker);

        // Wait for the end date to appear and select it
        await waitFor(() => {
          screen.getByText(startDay.toString());
        });
        userEvent.click(screen.getByText(startDay.toString()));

        // Click the "submit" button
        const submitButton = screen.getByRole('button', {
          name: 'Save',
        });
        userEvent.click(submitButton);
      });
    });
  });
});
