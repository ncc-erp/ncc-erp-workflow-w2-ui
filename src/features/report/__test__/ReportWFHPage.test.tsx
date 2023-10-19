import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import PostAndWFH from '..';
import userEvent from '@testing-library/user-event';

jest.mock('../../../api/apiHooks/index', () => ({
  useAxios: jest.fn(),
}));

jest.mock('../../../api/axiosInstant', () => ({
  VITE_API_BASE_URL: '/api',
}));

jest.mock('hooks/useIsAdmin', () => ({
  useIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock('api/apiHooks/reportHooks', () => ({
  useWfhList: jest.fn().mockReturnValue({
    isLoading: false,
    data: {
      totalCount: 1,
      items: [
        {
          email: 'van.nguyenhong@ncc.asia',
          totalDays: 7,
          totalPosts: 5,
          totalMissingPosts: 5,
          requests: [
            {
              workflowInstanceId: '3a0e24ba-576a-dda5-e576-309cd902ab3c',
              input: {
                CurrentOffice: 'HN1',
                Project: 'hr',
                Reason: 'test WFH',
                Dates: '09/10/2023,10/10/2023,11/10/2023',
              },
              tenantId: null,
              status: 0,
              creationTime: '2023-10-09T03:49:10.328496Z',
              creatorId: '3a059e91-b74f-f2a3-44eb-0a2863c0f138',
              id: '3a0e24ba-6c36-885b-6914-321d1df68aa4',
            },
            {
              workflowInstanceId: '3a0e24ba-ca14-cb9b-63d2-fd137dafeb65',
              input: {
                CurrentOffice: 'HN1',
                Project: 'REC',
                Reason: 'test',
                Dates: '08/08/2023,25/08/2023,03/08/2023',
              },
              tenantId: null,
              status: 0,
              creationTime: '2023-10-09T03:49:39.44981Z',
              creatorId: '3a059e91-b74f-f2a3-44eb-0a2863c0f138',
              id: '3a0e24ba-ddf8-771f-de87-d053c59021f3',
            },
            {
              workflowInstanceId: '3a0e24bb-e4d8-4237-5c65-fa9cc138febc',
              input: {
                CurrentOffice: 'HN1',
                Project: 'REC',
                Reason: 'test',
                Dates: '13/09/2023',
              },
              tenantId: null,
              status: 0,
              creationTime: '2023-10-09T03:50:50.994324Z',
              creatorId: '3a059e91-b74f-f2a3-44eb-0a2863c0f138',
              id: '3a0e24bb-f571-c3e7-7ead-00c694cfc1a7',
            },
            {
              workflowInstanceId: '3a0e24d9-e585-ac8b-58bc-565ca6433624',
              input: {
                CurrentOffice: 'HN1',
                Project: 'pre-sale',
                Reason: 'test',
                Dates: '09/10/2023,10/10/2023',
              },
              tenantId: null,
              status: 0,
              creationTime: '2023-10-09T04:23:38.040612Z',
              creatorId: '3a059e91-b74f-f2a3-44eb-0a2863c0f138',
              id: '3a0e24d9-f936-3cf6-3fd7-3d6864c83749',
            },
          ],
          requestDates: [
            '03/08/2023',
            '08/08/2023',
            '25/08/2023',
            '13/09/2023',
            '09/10/2023',
            '10/10/2023',
            '11/10/2023',
          ],
          posts: [
            {
              id: 1296,
              title: {
                rendered: 'Cùng khám phá Kỹ năng giao tiếp cơ bản',
              },
              status: 'publish',
              date: '2023-08-24T17:30:00',
              link: 'https://ant.ncc.asia/cung-kham-pha-ky-nang-giao-tiep-co-ban/',
            },
            {
              id: 1299,
              title: {
                rendered:
                  '​Linkedin Tips &#8211; 5 cách tiếp cận để làm Linkedin nổi bật',
              },
              status: 'publish',
              date: '2023-08-14T17:30:00',
              link: 'https://ant.ncc.asia/5-cach-tiep-can-de-lam-linkedin-noi-bat/',
            },
            {
              id: 1301,
              title: {
                rendered: '10 lời khuyên cho hồ sơ LinkedIn chuyên nghiệp',
              },
              status: 'publish',
              date: '2023-08-24T17:30:00',
              link: 'https://ant.ncc.asia/10-loi-khuyen-cho-ho-so-linkedin-chuyen-nghiep/',
            },
            {
              id: 1303,
              title: {
                rendered: 'Cùng khám phá thế giới drama văn phòng',
              },
              status: 'publish',
              date: '2023-08-24T17:30:00',
              link: 'https://ant.ncc.asia/cung-kham-pha-the-gioi-drama-van-phong/',
            },
            {
              id: 1305,
              title: {
                rendered:
                  'CAREER MAP: TIẾP CẬN CHIẾN LƯỢC MỤC TIÊU NGHỀ NGHIỆP',
              },
              status: 'publish',
              date: '2023-08-24T17:30:00',
              link: 'https://ant.ncc.asia/career-map-tiep-can-chien-luoc-muc-tieu-nghe-nghiep/',
            },
          ],
        },
      ],
    },
  }),
}));

describe('WFH Page', () => {
  const totalCount: number = 1;
  test('should match snapshot when rendering', () => {
    const queryClient: QueryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <PostAndWFH />
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
            <PostAndWFH />
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
