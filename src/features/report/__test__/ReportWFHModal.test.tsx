import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DetailModal } from '../components/DetailModal';
import { IPostAndWFH } from 'models/report';

describe('WFH Modal Detail', () => {
  const reportDetail: IPostAndWFH = {
    email: 'bob@example.com',
    totalDays: 7,
    totalMissingPosts: 3,
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
          rendered: 'CAREER MAP: TIẾP CẬN CHIẾN LƯỢC MỤC TIÊU NGHỀ NGHIỆP',
        },
        status: 'publish',
        date: '2023-08-24T17:30:00',
        link: 'https://ant.ncc.asia/career-map-tiep-can-chien-luoc-muc-tieu-nghe-nghiep/',
      },
    ],
    requests: [
      {
        workflowInstanceId: '3a0e2f0f-10ea-320d-f2da-7dc7be3e7688',
        input: {
          CurrentOffice: 'HN1',
          Project: 'hr',
          Reason: 'test',
          Dates:
            '11/10/2023,12/10/2023,14/08/2023,03/08/2023,21/09/2023,10/08/2023',
        },
        tenantId: '',
        creationTime: '2023-10-11T03:57:53.743222Z',
        creatorId: '3a059e91-b74f-f2a3-44eb-0a2863c0f138',
        id: '3a0e2f0f-20ce-b8ab-0db4-92149f136a67',
      },
      {
        workflowInstanceId: '3a0e2fdf-10ae-7350-0569-b37395c09005',
        input: {
          CurrentOffice: 'HN1',
          Project: 'REC',
          Reason: 'eqwwqe',
          Dates: '20/08/2023',
        },
        tenantId: '',
        creationTime: '2023-10-11T07:45:06.217695Z',
        creatorId: '3a059e91-b74f-f2a3-44eb-0a2863c0f138',
        id: '3a0e2fdf-24a8-88fb-2816-4881ce9a4dd2',
      },
    ],
    requestDates: [
      '03/08/2023',
      '10/08/2023',
      '14/08/2023',
      '20/08/2023',
      '21/09/2023',
      '11/10/2023',
      '12/10/2023',
    ],
  };

  const queryClient: QueryClient = new QueryClient();

  test('should match snapshot when rendering', () => {
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <DetailModal
          isOpen={true}
          onClose={() => jest.fn()}
          reportDetail={reportDetail}
          startDate={null}
          endDate={null}
        />
      </QueryClientProvider>
    );
    expect(baseElement).toMatchSnapshot();
  })


  describe('WFH Modal Detail with the data above', () => {
    beforeEach(() => {
      render(
        <QueryClientProvider client={queryClient}>
        <DetailModal
          isOpen={true}
          onClose={() => jest.fn()}
          reportDetail={reportDetail}
          startDate={null}
          endDate={null}
        />
      </QueryClientProvider>
      );
    });

    it('Should have a Title when Report Details loaded.',() => {
      expect(screen.getAllByText(/Report Details/i)).toBeTruthy()
    })

    it('Should have a email when Report Details loaded.',() => {
      expect(screen.getAllByText(/bob@example.com/i)).toBeTruthy()
    })

    describe('Post Details attributes',() => {
      it('Should have a Post Details attributes when Report Detail loaded.', async() => {
        screen.findByText(/Post Details/i)
      })
    })  

    describe('Request Details attributes', () => {
      it('Should have a Request Details attributes when Report Detail loaded.', async() => {
        screen.findByText(/Request Details/i)
      })
    })
  })
});
