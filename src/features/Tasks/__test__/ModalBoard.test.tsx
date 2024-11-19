import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModalBoard from 'common/components/Boards/ModalBoard';

// jest.mock('../../../api/apiHooks/index', () => ({
//     useAxios: jest.fn(),
// }));

// jest.mock('../../../api/axiosInstant', () => ({
//     VITE_API_BASE_URL: '/api',
// }));

// jest.mock('api/apiHooks/taskHooks', () => ({

// }))

jest.mock('@uiw/react-md-editor', () => jest.fn());
jest.mock('@uiw/react-markdown-preview', () => jest.fn());

test('Request My Requests Page', () => {
  const queryClient: QueryClient = new QueryClient();
  const { baseElement } = render(
    <QueryClientProvider client={queryClient}>
      <ModalBoard
        isOpen={true}
        onClose={() => jest.fn()}
        onConfirm={() => jest.fn()}
        showReason={true}
        setReason={() => jest.fn()}
        reason=""
        showDynamicForm={false}
        dynamicForm=""
        isDisabled={false}
        isLoading={false}
      />
    </QueryClientProvider>
  );
  expect(baseElement).toMatchSnapshot();
});
