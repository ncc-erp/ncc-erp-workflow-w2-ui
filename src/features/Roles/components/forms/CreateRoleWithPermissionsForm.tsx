import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  VStack,
  Input,
} from '@chakra-ui/react';
import PermissionCheckbox from 'common/components/PermissionCheckbox';
import { Permissions } from 'models/permissions';
import { Role } from 'models/roles';

interface CreateRoleWithPermissionsProps {
  onClose: () => void;
  onSubmit: (roleName: string, selectedPermissions: string[]) => void;
  permissions: Permissions[];
  isOpen: boolean;
  initialRoleName?: string;
  role?: Role;
}

const CreateRoleWithPermissionsForm: React.FC<
  CreateRoleWithPermissionsProps
> = ({ onClose, onSubmit, permissions, initialRoleName = '', role }) => {
  const [roleName, setRoleName] = useState(initialRoleName);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [codePermissions, setCodePermissions] = useState<string[]>([]);
  const [isTreeModified, setIsTreeModified] = useState(false);

  useEffect(() => {
    setRoleName(initialRoleName);
  }, [initialRoleName]);

  useEffect(() => {
    const newCodePermissions: string[] = [];
    role?.permissions?.forEach((perm) => {
      codePermissions.push(perm.code);
      perm.children?.forEach((child) => {
        codePermissions.push(child.code);
      });
    });
    setCodePermissions(newCodePermissions);
  }, [role, codePermissions]);

  const handleCheckboxChange = (updatedSelection: string[]) => {
    setSelectedPermissions(updatedSelection);
    setIsTreeModified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const permissionsToSubmit = isTreeModified
      ? selectedPermissions
      : codePermissions;
    onSubmit(roleName, permissionsToSubmit);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
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
            onChange={handleCheckboxChange}
            style={{ fontSize: '16px', color: 'black' }}
            role={role}
          />
        </FormControl>
        <Button mt="14px" type="submit" width="full">
          {role ? 'Update' : 'Create'}
        </Button>
      </VStack>
    </form>
  );
};

export default CreateRoleWithPermissionsForm;
