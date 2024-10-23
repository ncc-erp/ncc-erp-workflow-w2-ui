import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  VStack,
  Input,
} from '@chakra-ui/react';
import PermissionCheckbox from 'common/components/PermissionCheckbox';
import { Permissions } from 'models/permissions';

interface CreateRoleWithPermissionsProps {
  onClose: () => void;
  onSuccess: (roleName: string, selectedPermissions: string[]) => void;
  permissions: Permissions[];
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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreate();
      }}
    >
      <VStack spacing="14px">
        <FormControl mb={3}>
          <FormLabel fontWeight={500}>Role Name</FormLabel>
          <Input
            mt={3}
            placeholder="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel fontWeight={500}>Permissions</FormLabel>
        </FormControl>
        <FormControl>
          <PermissionCheckbox
            permission={permissions}
            selectedPermissions={selectedPermissions}
            onChange={handleCheckboxChange}
            style={{ fontSize: '16px', color: 'black' }}
          />
        </FormControl>

        <Button mt="14px" type="submit" width="full">
          Create
        </Button>
      </VStack>
    </form>
  );
};

export default CreateRoleWithPermissionsForm;
