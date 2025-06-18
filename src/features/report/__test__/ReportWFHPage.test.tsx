import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import PostAndWFH from '..';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { Permissions } from 'common/constants';

jest.mock('../../../api/apiHooks/index', () => ({
  useAxios: jest.fn(),
  useCreate: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isLoading: false,
    isError: false,
  })),
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

jest.mock('api/apiHooks/reportHooks', () => ({
  useWfhList: jest.fn().mockReturnValue({
    isLoading: false,
    data: {
      totalCount: 1,
      items: [
        {
          branch: 'ĐN',
          creationTime: '2024-11-28T14:13:29.407344Z',
          email: 'manh.nguyenvan@ncc.asia',
          id: '3a16854b-80bf-aed5-4252-7be0b33d10d2',
          reason: 'Crudelis synagoga alias earum.',
          remoteDate: 20241215,
          status: 1,
        },
      ],
    },
  }),
}));

jest.mock('hooks/useUserPermissions', () => ({
  useUserPermissions: jest.fn(() => ({
    hasPermission: jest.fn(() => [Permissions.VIEW_WFH_REPORTS]),
  })),
}));

describe('WFH Page', () => {
  const totalCount: number = 1;
  test('should match snapshot when rendering', () => {
    const queryClient: QueryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <Router>
            <PostAndWFH />
          </Router>
        </RecoilRoot>
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  describe('should behave as expected when total is 1', () => {
    const queryClient: QueryClient = new QueryClient();
    beforeEach(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <Router>
              <PostAndWFH />
            </Router>
          </RecoilRoot>
        </QueryClientProvider>
      );
    });

    it("should display the title 'Report WFH'", () => {
      expect(
        screen.getByRole('heading', { level: 1, name: /Report WFH/i })
      ).toBeInTheDocument();
    });

    it('should display the correct number of buttons on the screen', async () => {
      const buttonList = await screen.findAllByRole('button');
      expect(buttonList).toHaveLength(totalCount + 3);
    });

    it('should handle selecting rows per page', async () => {
      const options: string[] = ['10', '25', '50', '100'];
      for (const option of options) {
        const valueOption = screen.getByText(option);
        userEvent.click(valueOption);
        await screen.findByText(option);
      }
    });

    it('should display the search email', async () => {
      await screen.findByPlaceholderText('Enter email');
    });

    it('should display the input startDate', async () => {
      await screen.findByPlaceholderText('Start Date');
    });

    it('should display the input endDate', async () => {
      await screen.findByPlaceholderText('End Date');
    });
  });
});
