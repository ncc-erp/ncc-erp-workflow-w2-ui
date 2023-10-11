import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RequestForm from '../components/forms/RequestForm';
import { InputDefinition } from 'models/request';

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
};

test('Request Template Form', () => {
  const queryClient: QueryClient = new QueryClient();
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
