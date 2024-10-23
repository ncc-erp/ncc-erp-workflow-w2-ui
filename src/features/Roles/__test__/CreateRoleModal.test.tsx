import { render, screen, fireEvent } from '@testing-library/react';
import { CreateRoleModal } from '../components/modals/CreateRoleWithPermissionsModal';

describe('CreateRoleModal', () => {
  const mockOnCreateSuccess = jest.fn();

  test('renders modal and handles create role', () => {
    render(
      <CreateRoleModal
        isOpen={true}
        onClose={() => {}}
        OnCreateSuccess={mockOnCreateSuccess}
        permissions={[]}
      />
    );

    expect(screen.getByText('Create Role')).toBeInTheDocument();

    // Simulate filling the form and creating a role
    const roleNameInput = screen.getByLabelText('Role Name'); // Adjust based on your form inputs
    fireEvent.change(roleNameInput, { target: { value: 'New Role' } });
    fireEvent.click(screen.getByText('Create')); // Assuming there is a button to create the role

    expect(mockOnCreateSuccess).toHaveBeenCalledWith('New Role', []);
  });
});
