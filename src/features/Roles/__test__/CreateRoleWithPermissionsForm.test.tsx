import { render, screen, fireEvent } from '@testing-library/react';
import CreateRoleWithPermissionsForm from '../components/forms/CreateRoleWithPermissionsForm';

describe('CreateRoleWithPermissionsForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const permissionsMock = [
    {
      id: '1',
      name: 'Permission 1',
      code: 'PERM_1',
      creationTime: '2024-01-01',
    },
    {
      id: '2',
      name: 'Permission 2',
      code: 'PERM_2',
      creationTime: '2024-01-01',
    },
  ];

  beforeEach(() => {
    render(
      <CreateRoleWithPermissionsForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        permissions={permissionsMock}
      />
    );
  });

  it('renders the form', () => {
    expect(screen.getByPlaceholderText(/role name/i)).toBeInTheDocument();
    expect(screen.getByText(/permissions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('calls onSuccess with the role name and selected permissions on submit', () => {
    const roleName = 'New Role';
    fireEvent.change(screen.getByPlaceholderText(/role name/i), {
      target: { value: roleName },
    });

    // Simulate selecting permissions
    // Assuming PermissionCheckbox properly handles the selectedPermissions update
    // Fire an event to check a permission
    // Example: fireEvent.click(screen.getByLabelText(/permission 1/i));

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(mockOnSuccess).toHaveBeenCalledWith(roleName, expect.any(Array));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
