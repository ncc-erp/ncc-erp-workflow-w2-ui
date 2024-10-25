import { render, screen, fireEvent } from '@testing-library/react';
import { CreateRoleModal } from '../components/modals/CreateRoleWithPermissionsModal';
import {
  useCreateRole,
  useGetOneRole,
  useUpdateRole,
} from 'api/apiHooks/roleHook';

jest.mock('api/apiHooks/roleHook');
jest.mock('common/components/StandaloneToast');

describe('CreateRoleModal', () => {
  const mockOnSuccess = jest.fn();
  const mockCreateRole = jest.fn();
  const mockUpdateRole = jest.fn();

  beforeEach(() => {
    (useCreateRole as jest.Mock).mockReturnValue({ mutate: mockCreateRole });
    (useUpdateRole as jest.Mock).mockReturnValue({ mutate: mockUpdateRole });
    (useGetOneRole as jest.Mock).mockReturnValue({ data: undefined });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handles create role', async () => {
    render(
      <CreateRoleModal
        isOpen={true}
        onClose={() => {}}
        selectedRoleId={null}
        permissions={[]}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText('Role Name'), {
      target: { value: 'New Role' },
    });
    fireEvent.click(screen.getByText('Create'));

    expect(mockCreateRole).toHaveBeenCalledWith({
      name: 'New Role',
      permissionCodes: [],
    });
  });

  test('handles edit role', async () => {
    (useGetOneRole as jest.Mock).mockReturnValue({
      data: { name: 'Existing Role' },
    });

    render(
      <CreateRoleModal
        isOpen={true}
        onClose={() => {}}
        selectedRoleId="123"
        permissions={[]}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByLabelText('Role Name')).toHaveValue('Existing Role');
  });
});
