import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  VStack,
  Input,
  SimpleGrid,
} from '@chakra-ui/react';
import PermissionCheckbox from 'common/components/PermissionCheckbox';

interface Permission {
  id: number;
  name: string;
  children?: Permission[];
}

interface CreateRoleWithPermissionsProps {
  onClose: () => void;
  onSuccess: (roleName: string, selectedPermissions: string[]) => void;
  permissions: Permission[];
  isOpen: boolean;
}

const CreateRoleWithPermissionsForm: React.FC<
  CreateRoleWithPermissionsProps
> = ({ onClose, onSuccess, permissions }) => {
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleCheckboxChange = (updatedSelection: string[]) => {
    setSelectedPermissions(updatedSelection);
  };

  const handleCreate = () => {
    onSuccess(roleName, selectedPermissions);
    onClose();
  };
  const permissionCheckboxStyle = {
    fontSize: '16px',
    color: 'black',
    fontWeight: 400,
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreate();
      }}
    >
      <VStack spacing="14px">
        <FormControl mb={3}>
          <FormLabel fontWeight={300}>Role Name</FormLabel>
          <Input
            mt={3}
            placeholder="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel fontWeight={300}>Permissions</FormLabel>
        </FormControl>
        <SimpleGrid columns={4} spacing={5} style={{ fontSize: '14px' }}>
          {permissions.map((permission) => (
            <PermissionCheckbox
              key={permission.id}
              permission={permission}
              selectedPermissions={selectedPermissions}
              onChange={handleCheckboxChange}
              style={permissionCheckboxStyle}
            />
          ))}
        </SimpleGrid>

        <Button mt="14px" type="submit" width="full">
          Create
        </Button>
      </VStack>
    </form>
  );
};

export default CreateRoleWithPermissionsForm;
