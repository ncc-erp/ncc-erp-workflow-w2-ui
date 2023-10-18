import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RequestTemplates from '..';
import userEvent from '@testing-library/user-event';

jest.mock('../../../api/apiHooks/index', () => ({
  useAxios: jest.fn(),
}));

jest.mock('../../../api/axiosInstant', () => ({
  VITE_API_BASE_URL: '/api',
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

describe('Request Template Page', () => {
  const totalCount = 1;
  test('should match snapshot when rendering', () => {
    const queryClient: QueryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <RequestTemplates />
        </RecoilRoot>
      </QueryClientProvider>
    );
    expect(container).toMatchSnapshot();
  });

  describe('should behave as expected when total is 1 and items are "Change Office Request"', () => {
    const queryClient: QueryClient = new QueryClient();

    beforeEach(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <RequestTemplates />
          </RecoilRoot>
        </QueryClientProvider>
      );
    });

    it("should display the title 'Request Templates'", () => {
      expect(screen.getByText(/Request Templates/i)).toBeInTheDocument();
    });

    it('should display the correct number of buttons on the screen', async () => {
      const buttonList = await screen.findAllByRole('button');
      expect(buttonList).toHaveLength(totalCount + 1);
    });

    it('should handle selecting rows per page', async () => {
      const options: string[] = ['10', '25', '50', '100'];
      for (const option of options) {
        const valueOption = screen.getByText(option);
        userEvent.click(valueOption);
        await screen.findByText(option);
      }
    });
  });
});
