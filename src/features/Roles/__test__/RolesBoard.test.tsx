import { render, screen, fireEvent } from '@testing-library/react';
import {
  useGetAllRoles,
  useGetAllPermissions,
  useCreateRole,
} from 'api/apiHooks/roleHook';
import { RolesBoard } from '../components/RolesBoard';

// Mô phỏng các hooks
jest.mock('api/apiHooks/roleHook', () => ({
  useGetAllRoles: jest.fn(),
  useGetAllPermissions: jest.fn(),
  useCreateRole: jest.fn(),
}));

beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

describe('RolesBoard', () => {
  const mockRefetch = jest.fn();
  const mockCreateRole = jest.fn();
  const rolesData = { items: [{ id: '1', name: 'Admin', isDefault: false }] };
  const permissionsData = [
    { id: '1', name: 'View', code: 'VIEW', creationTime: '2024-01-01' },
  ];

  beforeEach(() => {
    (useGetAllRoles as jest.Mock).mockReturnValue({
      data: rolesData,
      refetch: mockRefetch,
    });
    (useGetAllPermissions as jest.Mock).mockReturnValue({
      data: permissionsData,
    });
    (useCreateRole as jest.Mock).mockReturnValue({ mutate: mockCreateRole });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the RolesBoard component', () => {
    render(<RolesBoard />);
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('opens the create role modal when clicking Create button', () => {
    render(<RolesBoard />);
    fireEvent.click(screen.getByText('Create'));
    expect(screen.getByText('Create Role')).toBeInTheDocument();
  });
  test('displays a message when there are no roles', () => {
    (useGetAllRoles as jest.Mock).mockReturnValue({
      data: { items: [] },
      refetch: mockRefetch,
    });
    render(<RolesBoard />);
    expect(screen.getByText('No roles found!')).toBeInTheDocument();
  });

  // Test mới để kiểm tra không có nút edit
  test('does not render edit button', () => {
    render(<RolesBoard />);
    expect(
      screen.queryByRole('button', { name: /edit/i })
    ).not.toBeInTheDocument();
  });
});
