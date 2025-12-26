import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useGetAllPermissions } from 'api/apiHooks/roleHook';
import {
  useCreatePermission,
  useDeletePermission,
  useUpdatePermission,
} from 'api/apiHooks/permissionHook';
import { ModalConfirm } from 'common/components/ModalConfirm';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import { BiSolidPencil } from 'react-icons/bi';
interface Permission {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  children?: Permission[];
}
const PermissionsTable = () => {
  const { renderIfAllowed } = useUserPermissions();
  const { data: permissionsData, refetch } = useGetAllPermissions();
  const { mutate: updatePermission } = useUpdatePermission();
  const { mutateAsync: deleteMutate } = useDeletePermission();
  const createPermission = useCreatePermission();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<'parent' | 'child' | 'edit'>(
    'parent'
  );
  const [newPermission, setNewPermission] = useState({ name: '', code: '' });
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(
    null
  );
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const toast = useToast();
  const [errors, setErrors] = useState<{
    name: string | null;
    code: string | null;
  }>({
    name: null,
    code: null,
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<string | null>(null);
  const handleAddParentPermission = () => {
    setModalType('parent');
    setSelectedParentId(null);
    setNewPermission({ name: '', code: '' });
    onOpen();
  };
  const handleAddChildPermission = (parentId: string) => {
    setModalType('child');
    setSelectedParentId(parentId);
    setNewPermission({ name: '', code: '' });
    onOpen();
  };
  const handleEditPermission = (permission: Permission, parentId?: string) => {
    setModalType('edit');
    setSelectedParentId(parentId || null);
    setNewPermission({ name: permission.name, code: permission.code });
    setCurrentPermission(permission);
    onOpen();
  };
  const handleSavePermission = async () => {
    const newErrors = {
      name: newPermission.name.trim() ? '' : 'Name is required.',
      code: newPermission.code.trim() ? '' : 'Code is required.',
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.code) return;
    const payload = {
      name: newPermission.name,
      code: newPermission.code,
      parentId: selectedParentId ?? undefined,
    };
    if (modalType === 'edit' && currentPermission) {
      updatePermission(
        {
          id: currentPermission.id,
          data: {
            name: payload.name,
            code: payload.code,
            parentId: payload.parentId ?? undefined,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: 'Permission updated successfully!',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top',
            });
            refetch();
            onClose();
          },
          onError: () => {
            toast({
              title: 'Error updating permission.',
              status: 'error',
              duration: 3000,
              isClosable: true,
              position: 'top',
            });
          },
        }
      );
    } else {
      createPermission.mutate(payload, {
        onSuccess: () => {
          toast({
            title: 'Permission created successfully!',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
          refetch();
          onClose();
        },
        onError: () => {
          toast({
            title: 'Error creating permission.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        },
      });
    }
  };
  const handleDeletePermission = (permissionId: string) => {
    deleteMutate(permissionId, {
      onSuccess: () => {
        toast({
          title: 'Permission deleted successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        refetch();
      },
      onError: () => {
        toast({
          title: 'Error deleting permission.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      },
    });
  };
  const handleClose = () => {
    setNewPermission({ name: '', code: '' });
    setErrors({ name: null, code: null });
    onClose();
  };
  const handleOpenConfirm = (permissionId: string) => {
    setConfirmData(permissionId);
    setIsConfirmOpen(true);
  };
  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setConfirmData(null);
  };
  return (
    <Box py={5}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Button
          leftIcon={<BiSolidPencil size={20} />}
          onClick={handleAddParentPermission}
          variant="primary"
        >
          Create
        </Button>
      </Box>
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th px={['8px', '12px']}>Permission Group</Th>
              <Th
                px={['8px', '12px']}
                display={{ base: 'none', md: 'table-cell' }}
              >
                Code
              </Th>
              <Th px={['8px', '12px']} textAlign="center">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(permissionsData) && permissionsData.length > 0 ? (
              permissionsData.map((parent) => (
                <React.Fragment key={parent.id}>
                  <Tr bg="highlightRow">
                    <Td fontWeight="bold" fontSize={15} px={['8px', '12px']}>
                      {parent.name}
                    </Td>
                    <Td
                      fontSize={15}
                      px={['8px', '12px']}
                      display={{ base: 'none', md: 'table-cell' }}
                    >
                      {parent.code}
                    </Td>
                    <Td px={['8px', '12px']}>
                      {renderIfAllowed(
                        Permissions.UPDATE_PERMISSION,
                        <IconButton
                          aria-label="Edit Parent"
                          icon={<EditIcon />}
                          colorScheme="yellow"
                          onClick={() => handleEditPermission(parent)}
                          size={'sm'}
                          mr={2}
                        />
                      )}
                      {renderIfAllowed(
                        Permissions.DELETE_PERMISSION,
                        parent.children && parent.children.length === 0 && (
                          <IconButton
                            aria-label="Delete Parent"
                            icon={<DeleteIcon />}
                            variant="primary"
                            onClick={() => handleOpenConfirm(parent.id)}
                            mr={2}
                            size={'sm'}
                          />
                        )
                      )}
                      {renderIfAllowed(
                        Permissions.CREATE_PERMISSION,
                        <IconButton
                          aria-label="Add Child"
                          icon={<AddIcon />}
                          colorScheme="blue"
                          onClick={() => handleAddChildPermission(parent.id)}
                          size={'sm'}
                        />
                      )}
                    </Td>
                  </Tr>
                  {Array.isArray(parent.children) &&
                    parent.children.map((child: Permission) => (
                      <Tr key={child.id}>
                        <Td px={['8px', '12px']} fontSize={15}>
                          {child.name}
                        </Td>
                        <Td
                          fontSize={14}
                          px={['8px', '12px']}
                          display={{ base: 'none', md: 'table-cell' }}
                        >
                          {child.code}
                        </Td>
                        <Td display="flex" px={['8px', '12px']}>
                          {renderIfAllowed(
                            Permissions.UPDATE_PERMISSION,
                            <IconButton
                              aria-label="Edit Child"
                              icon={<EditIcon />}
                              colorScheme="yellow"
                              onClick={() =>
                                handleEditPermission(child, parent.id)
                              }
                              size={'sm'}
                              mr={2}
                            />
                          )}
                          {renderIfAllowed(
                            Permissions.DELETE_PERMISSION,
                            <IconButton
                              aria-label="Delete Child"
                              icon={<DeleteIcon />}
                              variant="primary"
                              onClick={() => handleOpenConfirm(child.id)}
                              size={'sm'}
                            />
                          )}
                        </Td>
                      </Tr>
                    ))}
                </React.Fragment>
              ))
            ) : (
              <Tr>
                <Td textAlign={'center'} colSpan={3}>
                  No permissions available.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === 'parent'
              ? 'Add Parent Permission'
              : 'Add Child Permission'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                required
                value={newPermission.name}
                onChange={(e) =>
                  setNewPermission((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.code}>
              <FormLabel>Code</FormLabel>
              <Input
                required
                value={newPermission.code}
                onChange={(e) =>
                  setNewPermission((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }))
                }
              />
              <FormErrorMessage>{errors.code}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSavePermission}>
              Save
            </Button>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ModalConfirm
        title="Confirm Deletion"
        description="Are you sure you want to delete this permission? This action cannot be undone."
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={() => {
          if (confirmData) {
            handleDeletePermission(confirmData);
          }
          handleCloseConfirm();
        }}
      />
    </Box>
  );
};
export default PermissionsTable;
