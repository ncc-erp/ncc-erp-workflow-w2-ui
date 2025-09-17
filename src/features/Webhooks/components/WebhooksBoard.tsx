import {
  Box,
  Button,
  Center,
  Divider,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import {
  useDeleteWebhook,
  useGetAllWebhooks,
  useUpdateWebhook,
  useCreateWebhook,
} from 'api/apiHooks/webhookHooks';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { Table } from 'common/components/Table/Table';
import { Webhook } from 'models/webhook';
import { useMemo, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { TbTrash } from 'react-icons/tb';
import { ModalConfirm } from 'common/components/ModalConfirm';
import { toast } from 'common/components/StandaloneToast';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import EditWebhookForm from './forms/EditWebhookForm';
import { useTranslation } from 'react-i18next';

export const WebhooksBoard = () => {
  const { t } = useTranslation();
  const { data: webhookData, refetch: refetchWebhooks } = useGetAllWebhooks();
  const { mutate: deleteWebhook } = useDeleteWebhook();
  const { mutate: updateWebhook } = useUpdateWebhook();
  const { mutate: createWebhook } = useCreateWebhook();
  const { renderIfAllowed, hasPermission } = useUserPermissions();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(
    null
  );
  const [webhookIdToDelete, setWebhookIdToDelete] = useState<string | null>(
    null
  );
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [webhookName, setWebhookName] = useState<string>('');
  const [eventNames, setEventNames] = useState<string[]>([]);
  const maxUrlLength = 70;

  const myColumns: ColumnDef<Webhook>[] = useMemo(() => {
    return [
      {
        accessorKey: 'WebhookName',
        header: () => <Box mr={6}>{t('WEBHOOKS_PAGE.WEBHOOK_NAME')}</Box>,
        cell: (info) => <Box mr={6}>{info.row.original.webhookName}</Box>,
        enableSorting: false,
      },
      {
        accessorKey: 'url',
        header: () => <Box px={6}>{t('WEBHOOKS_PAGE.WEBHOOK_URL')}</Box>,
        cell: (info) => {
          const fullUrl = info.row.original.url;
          const truncatedUrl =
            fullUrl.length > maxUrlLength
              ? `${fullUrl.slice(0, maxUrlLength)}...`
              : fullUrl;

          return (
            <Box
              title={fullUrl}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              px={6}
            >
              {truncatedUrl}
            </Box>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'action',
        header: () => <Center w="full">{t('WEBHOOKS_PAGE.ACTION')}</Center>,
        cell: ({ row }: { row: { original: Webhook } }) => (
          <Center>
            {hasPermission(Permissions.UPDATE_WEBHOOK) && (
              <IconButton
                onClick={() => handleEdit(row.original)}
                aria-label="edit webhook"
                icon={<AiOutlineEdit />}
                backgroundColor="actionBtnBg"
                color="paginationText"
              />
            )}
            {hasPermission(Permissions.DELETE_WEBHOOK) && (
              <IconButton
                onClick={() => handleDelete(row.original.id ?? '')}
                aria-label="delete webhook"
                icon={<TbTrash />}
                backgroundColor="actionBtnBg"
                color="paginationText"
                ml={2}
              />
            )}
          </Center>
        ),
        enableSorting: false,
      },
    ];
  }, [hasPermission, t]);

  const onOpenCreateModal = () => {
    setSelectedWebhookId(null);
    setWebhookUrl('');
    setWebhookName('');
    setEventNames([]);
    setIsModalOpen(true);
  };

  const handleEdit = (webhook: Webhook) => {
    console.log('Editing webhook:', webhook);
    setSelectedWebhookId(webhook.id ?? null);
    setWebhookUrl(webhook.url);
    setWebhookName(webhook.webhookName);
    setEventNames(webhook.eventNames);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWebhookId(null);
    setWebhookUrl('');
    setWebhookName('');
    setEventNames([]);
  };

  const handleDelete = (webhookId: string) => {
    setWebhookIdToDelete(webhookId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteWebhook = (webhookId: string) => {
    deleteWebhook(webhookId, {
      onSuccess: () => {
        toast({
          title: t('WEBHOOKS_PAGE.WEBHOOK_DELETED_SUCCESSFULLY'),
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        refetchWebhooks();
      },
    });
  };

  const handleSubmit = async (
    url: string,
    webhookName: string,
    eventNames: string[]
  ) => {
    if (selectedWebhookId) {
      updateWebhook(
        {
          id: selectedWebhookId,
          data: { url, webhookName, eventNames },
        },
        {
          onSuccess: () => {
            toast({
              title: t('WEBHOOKS_PAGE.WEBHOOK_UPDATED_SUCCESSFULLY'),
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top',
            });
            refetchWebhooks();
            onCloseModal();
          },
        }
      );
    } else {
      createWebhook(
        {
          url,
          webhookName,
          eventNames,
        },
        {
          onSuccess: () => {
            toast({
              title: t('WEBHOOKS_PAGE.WEBHOOK_CREATED_SUCCESSFULLY'),
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top',
            });
            refetchWebhooks();
            onCloseModal();
          },
        }
      );
    }
  };

  return (
    <>
      {renderIfAllowed(
        Permissions.VIEW_WEBHOOKS,
        <Box>
          {renderIfAllowed(
            Permissions.CREATE_WEBHOOK,
            <Box>
              <Button
                size="md"
                fontSize="sm"
                fontWeight="medium"
                colorScheme="green"
                onClick={onOpenCreateModal}
                mb={4}
              >
                {t('WEBHOOKS_PAGE.CREATE')}
              </Button>
            </Box>
          )}
          <EmptyWrapper
            isEmpty={!webhookData?.items.length}
            h="200px"
            fontSize="xs"
            message={t('WEBHOOKS_PAGE.NO_WEBHOOKS_FOUND')}
            boxSizing="border-box"
          >
            <Box
              w={{ base: '100%', lg: '100%', xs: 'max-content' }}
              pt="10px"
              paddingBottom={10}
            >
              <Table
                columns={myColumns}
                data={webhookData?.items || []}
                isLoading={false}
                onRowHover={true}
                isHighlight={true}
                dataTestId="webhooks-item"
              />
            </Box>
          </EmptyWrapper>
          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              onClose={onCloseModal}
              closeOnOverlayClick={false}
              size="2xl"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader fontSize="lg">
                  {selectedWebhookId
                    ? t('WEBHOOKS_PAGE.EDIT_WEBHOOK')
                    : t('WEBHOOKS_PAGE.CREATE_WEBHOOK')}
                </ModalHeader>
                <Divider />
                <ModalCloseButton />
                <ModalBody p={0}>
                  <EditWebhookForm
                    isOpen={isModalOpen}
                    onClose={onCloseModal}
                    onSubmit={handleSubmit}
                    webhookName={webhookName}
                    url={webhookUrl}
                    eventNames={eventNames}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )}

          <ModalConfirm
            title={t('WEBHOOKS_PAGE.DELETE_CONFIRMATION')}
            description={t('WEBHOOKS_PAGE.DELETE_CONFIRMATION_MESSAGE')}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              if (webhookIdToDelete) {
                handleDeleteWebhook(webhookIdToDelete);
              }
              setIsDeleteModalOpen(false);
            }}
          />
        </Box>
      )}
    </>
  );
};
