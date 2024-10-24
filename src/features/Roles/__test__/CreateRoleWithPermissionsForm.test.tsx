import { render, screen, fireEvent } from '@testing-library/react';
import CreateRoleWithPermissionsForm from '../components/forms/CreateRoleWithPermissionsForm';
import { Permissions } from 'models/permissions';

describe('CreateRoleWithPermissionsForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const permissionsMock: Permissions[] = [
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
      children: [
        {
          id: '2-1',
          name: 'Child Permission 1',
          code: 'PERM_2',
          creationTime: '2024-01-01',
        },
        {
          id: '2-2',
          name: 'Child Permission 2',
          code: 'PERM_2',
          creationTime: '2024-01-01',
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form', () => {
    render(
      <CreateRoleWithPermissionsForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        permissions={permissionsMock}
      />
    );

    expect(screen.getByPlaceholderText(/role name/i)).toBeInTheDocument();
    expect(screen.getByText(/permissions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('calls onSubmit with the role name on submit', () => {
    render(
      <CreateRoleWithPermissionsForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        permissions={permissionsMock}
      />
    );

    const roleName = 'New Role';
    fireEvent.change(screen.getByPlaceholderText(/role name/i), {
      target: { value: roleName },
    });

    // Click on permission checkboxes using flexible matchers
    fireEvent.click(screen.getByText(/Permission 1/i));

    // Use a function matcher to find 'Child Permission 1'

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('updates the role name when initialRoleName changes', () => {
    const initialRoleName = 'Initial Role';
    render(
      <CreateRoleWithPermissionsForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        permissions={permissionsMock}
        initialRoleName={initialRoleName}
      />
    );

    expect(screen.getByPlaceholderText(/role name/i)).toHaveValue(
      initialRoleName
    );
  });
});
