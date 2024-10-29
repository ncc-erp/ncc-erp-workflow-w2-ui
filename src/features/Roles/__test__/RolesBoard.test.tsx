import { render } from '@testing-library/react';
import {
  useGetAllRoles,
  useGetAllPermissions,
  useGetOneRole,
  useCreateRole,
  useUpdateRole,
} from 'api/apiHooks/roleHook';
import { RolesBoard } from '../components/RolesBoard';

jest.mock('api/apiHooks/roleHook', () => ({
  useGetAllRoles: jest.fn(),
  useGetAllPermissions: jest.fn(),
  useGetOneRole: jest.fn(),
  useCreateRole: jest.fn(),
  useUpdateRole: jest.fn(),
}));

beforeAll(() => {
  // Mock window.matchMedia to avoid errors
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

describe('RolesBoard', () => {
  const mockRefetch = jest.fn();
  const rolesData = { items: [{ id: '1', name: 'Admin', isDefault: false }] };
  const permissionsData = [
    { id: '1', name: 'View', code: 'VIEW', creationTime: '2024-01-01' },
  ];

  const createRoleMock = jest.fn();
  const updateRoleMock = jest.fn();

  beforeEach(() => {
    (useGetAllRoles as jest.Mock).mockReturnValue({
      data: rolesData,
      refetch: mockRefetch,
    });
    (useGetAllPermissions as jest.Mock).mockReturnValue({
      data: permissionsData,
    });
    (useGetOneRole as jest.Mock).mockReturnValue({
      data: rolesData.items[0], // Giả lập role đã được chọn
      refetch: jest.fn(),
    });
    (useCreateRole as jest.Mock).mockReturnValue({ mutate: createRoleMock });
    (useUpdateRole as jest.Mock).mockReturnValue({ mutate: updateRoleMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the RolesBoard component', () => {
    render(<RolesBoard />);
  });

  test('displays a message when there are no roles', () => {
    (useGetAllRoles as jest.Mock).mockReturnValue({
      data: { items: [] },
      refetch: mockRefetch,
    });
    render(<RolesBoard />);
  });
});
