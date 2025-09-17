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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      name: newPermission.name.trim()
        ? ''
        : t('PERMISSIONS_PAGE.VALIDATION.NAME_REQUIRED'),
      code: newPermission.code.trim()
        ? ''
        : t('PERMISSIONS_PAGE.VALIDATION.CODE_REQUIRED'),
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
              title: t('PERMISSIONS_PAGE.MESSAGES.UPDATE_SUCCESS'),
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
              title: t('PERMISSIONS_PAGE.MESSAGES.UPDATE_ERROR'),
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
            title: t('PERMISSIONS_PAGE.MESSAGES.CREATE_SUCCESS'),
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
            title: t('PERMISSIONS_PAGE.MESSAGES.CREATE_ERROR'),
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
          title: t('PERMISSIONS_PAGE.MESSAGES.DELETE_SUCCESS'),
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        refetch();
      },
      onError: () => {
        toast({
          title: t('PERMISSIONS_PAGE.MESSAGES.DELETE_ERROR'),
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

  const getModalTitle = () => {
    if (modalType === 'edit') {
      return t('PERMISSIONS_PAGE.MODAL.EDIT_PERMISSION');
    }
    return modalType === 'parent'
      ? t('PERMISSIONS_PAGE.MODAL.ADD_PARENT_PERMISSION')
      : t('PERMISSIONS_PAGE.MODAL.ADD_CHILD_PERMISSION');
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
          {t('PERMISSIONS_PAGE.BUTTONS.CREATE_PERMISSION')}
        </Button>
      </Box>
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th px={['8px', '12px']}>
                {t('PERMISSIONS_PAGE.TABLE.PERMISSION_GROUP')}
              </Th>
              <Th px={['8px', '12px']}>{t('PERMISSIONS_PAGE.TABLE.CODE')}</Th>
              <Th px={['8px', '12px']} textAlign="center">
                {t('PERMISSIONS_PAGE.TABLE.ACTIONS')}
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
                    <Td fontSize={15} px={['8px', '12px']}>
                      {parent.code}
                    </Td>
                    <Td px={['8px', '12px']}>
                      {renderIfAllowed(
                        Permissions.UPDATE_PERMISSION,
                        <IconButton
                          aria-label={t('PERMISSIONS_PAGE.BUTTONS.EDIT')}
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
                            aria-label={t('PERMISSIONS_PAGE.BUTTONS.DELETE')}
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
                          aria-label={t('PERMISSIONS_PAGE.BUTTONS.ADD_CHILD')}
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
                        <Td fontSize={14} px={['8px', '12px']}>
                          {child.code}
                        </Td>
                        <Td display="flex" px={['8px', '12px']}>
                          {renderIfAllowed(
                            Permissions.UPDATE_PERMISSION,
                            <IconButton
                              aria-label={t('PERMISSIONS_PAGE.BUTTONS.EDIT')}
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
                              aria-label={t('PERMISSIONS_PAGE.BUTTONS.DELETE')}
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
                  {t('PERMISSIONS_PAGE.TABLE.NO_PERMISSIONS_FOUND')}
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{getModalTitle()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isInvalid={!!errors.name}>
              <FormLabel>{t('PERMISSIONS_PAGE.FORM.NAME')}</FormLabel>
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
              <FormLabel>{t('PERMISSIONS_PAGE.FORM.CODE')}</FormLabel>
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
              {t('PERMISSIONS_PAGE.BUTTONS.SAVE')}
            </Button>
            <Button variant="ghost" onClick={handleClose}>
              {t('PERMISSIONS_PAGE.BUTTONS.CANCEL')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ModalConfirm
        title={t('PERMISSIONS_PAGE.MODAL.CONFIRM_DELETE')}
        description={t('PERMISSIONS_PAGE.MODAL.DELETE_CONFIRMATION')}
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
