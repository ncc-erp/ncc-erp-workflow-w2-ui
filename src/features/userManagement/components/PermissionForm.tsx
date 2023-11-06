import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useUserPermissionByUserId } from 'api/apiHooks/userIdentityHooks';
import { useState } from 'react';
import styles from './style.module.scss';
import {
  IPermissionItem,
  IPermissionList,
  IPermissionRequestItem,
  IUpdateUserPermissionRequest,
} from 'models/permission';
import { ConfirmModal } from './ConfirmModal';
import { useForm } from 'react-hook-form';
import { toast } from 'common/components/StandaloneToast';

type FormParams = Record<string, boolean>;

interface PermissionFormProps {
  userId: string;
  onClose: () => void;
}

const PermissionForm = ({ userId, onClose }: PermissionFormProps) => {
  const { data: userPermissions } = useUserPermissionByUserId(userId);

  const [formParamsOrigin] = useState<FormParams>({});
  const [formParams, setFormParams] = useState<FormParams>({});
  const [allAndSuperPermissions, setAllAndSuperPermissions] = useState<
    Record<string, boolean>
  >({ All: false });
  const [quantityCheckbox, setQuantityCheckbox] = useState<
    Record<string, number>
  >({ All: 0, AllChecked: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);

  // useEffect(() => {
  //   setQuantityCheckbox((prevState) => {
  //     return {
  //       ...prevState,
  //       ...quantityCheckbox,
  //     };
  //   });
  // }, [quantityCheckbox['All'], quantityCheckbox['AllChecked']]);

  const { handleSubmit } = useForm<FormParams>({});

  const formatFormParam = () => {
    const formParamsClone = { ...formParams };
    const arrayPermissions: Array<IPermissionRequestItem> = [];

    Object.keys(formParamsClone).forEach((key) => {
      const keySplitted = key.split('_');

      const permission: IPermissionRequestItem = {
        name: keySplitted[keySplitted.length - 1],
        isGranted: formParamsClone[key],
      };

      arrayPermissions.push(permission);
    });

    return arrayPermissions;
  };

  const onSubmit = async () => {
    setIsLoading(true);

    const requestDataFormatted = formatFormParam();

    const requestBody: IUpdateUserPermissionRequest = {
      permissions: requestDataFormatted,
    };

    console.log(requestBody);
    //todo - handle call api update here

    // const { data: update } = (userId);

    toast({
      description: 'Updated User Permissions Successfully',
      status: 'success',
    });

    onClose();
  };

  const onCloseModal = () => {
    setIsOpenConfirmModal(false);
  };

  const onConfirmModal = () => {
    setIsOpenConfirmModal(false);
    onClose();
  };

  const isChangeFormParams = () => {
    let d = 0;

    Object.keys(formParamsOrigin).forEach((key: string) => {
      if (formParams[key] !== formParamsOrigin[key]) {
        d++;
      }
    });

    return d !== 0;
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (
      userPermissions?.groups[0]?.permissions[0]?.grantedProviders[0]
        ?.providerName === 'R'
    ) {
      return;
    }

    const updatedAllAndSuperPermission = { ...allAndSuperPermissions };
    const updatedQuantityCheckbox = { ...quantityCheckbox };
    const updatedFormParams = { ...formParams };

    let superParent: string;
    let superParentOfChild;
    let parent;
    switch (type) {
      case 'All':
        Object.keys(updatedAllAndSuperPermission).forEach((key: string) => {
          updatedAllAndSuperPermission[key] = e.target.checked;
        });

        Object.keys(updatedQuantityCheckbox).forEach((key: string) => {
          if (key.includes('Checked')) {
            if (e.target.checked) {
              updatedQuantityCheckbox[key] =
                updatedQuantityCheckbox[key.replace('Checked', '')];
            } else {
              updatedQuantityCheckbox[key] = 0;
            }
          }
        });

        Object.keys(updatedFormParams).forEach((key: string) => {
          updatedFormParams[key] = e.target.checked;
        });

        break;

      case 'super':
        updatedAllAndSuperPermission[e.target.name] = e.target.checked;

        Object.keys(updatedQuantityCheckbox).forEach((key: string) => {
          if (key.includes('Checked') && key.includes(e.target.name)) {
            if (e.target.checked) {
              if (key.split('_').length == 1) {
                updatedQuantityCheckbox['AllChecked'] +=
                  updatedQuantityCheckbox[key.replace('Checked', '')] -
                  updatedQuantityCheckbox[key];
              }

              updatedQuantityCheckbox[key] =
                updatedQuantityCheckbox[key.replace('Checked', '')];
            } else {
              if (key.split('_').length == 1) {
                updatedQuantityCheckbox['AllChecked'] -=
                  updatedQuantityCheckbox[key];
              }

              updatedQuantityCheckbox[key] = 0;
            }
          }
        });

        Object.keys(updatedFormParams).forEach((key: string) => {
          if (key.includes(e.target.name)) {
            updatedFormParams[key] = e.target.checked;
          }
        });

        break;

      case 'parent':
        superParent = e.target.name.split('_')[0];
        if (!e.target.checked) {
          Object.keys(updatedFormParams).forEach((key: string) => {
            if (
              key.includes(e.target.name) &&
              updatedFormParams[key] === true
            ) {
              updatedFormParams[key] = e.target.checked;
              updatedQuantityCheckbox[superParent + 'Checked'] -= 1;
              updatedQuantityCheckbox['AllChecked'] -= 1;
            }
          });
        } else {
          updatedFormParams[e.target.name] = e.target.checked;
          updatedQuantityCheckbox[superParent + 'Checked'] += 1;
          updatedQuantityCheckbox['AllChecked'] += 1;
        }

        //Check super
        if (
          updatedQuantityCheckbox[superParent] ===
          updatedQuantityCheckbox[superParent + 'Checked']
        ) {
          updatedAllAndSuperPermission[superParent] = true;
        }

        if (updatedQuantityCheckbox[superParent + 'Checked'] == 0) {
          updatedAllAndSuperPermission[superParent] = false;
        }

        break;

      default: //child
        superParentOfChild = e.target.name.split('_')[0];
        parent = e.target.name.split('_')[1];
        updatedFormParams[e.target.name] = e.target.checked;

        if (e.target.checked) {
          updatedQuantityCheckbox[superParentOfChild + 'Checked'] += 1;
          updatedQuantityCheckbox['AllChecked'] += 1;

          if (updatedFormParams[superParentOfChild + '_' + parent] === false) {
            updatedQuantityCheckbox[superParentOfChild + 'Checked'] += 1;
            updatedQuantityCheckbox['AllChecked'] += 1;
            updatedFormParams[superParentOfChild + '_' + parent] = true;
          }
        } else {
          updatedQuantityCheckbox[superParentOfChild + 'Checked'] -= 1;
          updatedQuantityCheckbox['AllChecked'] -= 1;
        }

        //Check super
        if (
          updatedQuantityCheckbox[superParentOfChild] ===
          updatedQuantityCheckbox[superParentOfChild + 'Checked']
        ) {
          updatedAllAndSuperPermission[superParentOfChild] = true;
        }

        if (updatedQuantityCheckbox[superParentOfChild + 'Checked'] == 0) {
          updatedAllAndSuperPermission[superParentOfChild] = false;
        }

        break;
    }

    if (
      updatedQuantityCheckbox['AllChecked'] === updatedQuantityCheckbox['All']
    ) {
      updatedAllAndSuperPermission['All'] = true;
    }

    if (updatedQuantityCheckbox['AllChecked'] === 0) {
      updatedAllAndSuperPermission['All'] = false;
    }

    setAllAndSuperPermissions(updatedAllAndSuperPermission);
    setQuantityCheckbox(updatedQuantityCheckbox);
    setFormParams(updatedFormParams);
  };

  const renderTabList = () => {
    return userPermissions?.groups.map((item) => {
      return (
        <Tab
          key={item?.name}
          _selected={{ color: 'white', bg: 'blue.400' }}
          className={
            quantityCheckbox[item?.name + 'Checked']
              ? styles.customTabHasChecked
              : styles.customTab
          }
        >
          {item?.displayName +
            '(' +
            quantityCheckbox[item?.name + 'Checked'] +
            ')'}
        </Tab>
      );
    });
  };

  const renderTabContentBody = (item: IPermissionList) => {
    return item?.permissions.map((permission: IPermissionItem) => {
      //Render Child
      if (permission?.parentName) {
        const fieldName =
          item?.name + '_' + permission.parentName + '_' + permission.name;

        if (!(fieldName in formParams)) {
          formParams[fieldName] = permission?.isGranted;
          formParamsOrigin[fieldName] = permission?.isGranted;

          if (permission?.isGranted) {
            quantityCheckbox[item?.name + 'Checked']++;
            quantityCheckbox['AllChecked']++;

            if (
              quantityCheckbox[item?.name] ==
              quantityCheckbox[item?.name + 'Checked']
            ) {
              allAndSuperPermissions[item?.name] = true;
            }

            if (quantityCheckbox['All'] == quantityCheckbox['AllChecked']) {
              allAndSuperPermissions['All'] = true;
            }
          }
        }

        return (
          <Checkbox
            className={styles.childCheckbox}
            isChecked={formParams[fieldName]}
            key={permission?.name}
            name={fieldName}
            onChange={(e) => handleOnChange(e, 'child')}
            isDisabled={permission?.grantedProviders[0]?.providerName === 'R'}
          >
            {permission?.displayName}{' '}
            {permission?.grantedProviders[0]?.providerName === 'R'
              ? ' (R)'
              : ''}
          </Checkbox>
        );
      }

      //Render Parent
      else {
        if (!(item?.name + '_' + permission?.name in formParams)) {
          formParams[item?.name + '_' + permission?.name] =
            permission?.isGranted;
          formParamsOrigin[item?.name + '_' + permission?.name] =
            permission?.isGranted;

          if (permission?.isGranted) {
            quantityCheckbox[item?.name + 'Checked']++;
            quantityCheckbox['AllChecked']++;

            if (
              quantityCheckbox[item?.name] ==
              quantityCheckbox[item?.name + 'Checked']
            ) {
              allAndSuperPermissions[item?.name] = true;
            }

            if (quantityCheckbox['All'] == quantityCheckbox['AllChecked']) {
              allAndSuperPermissions['All'] = true;
            }
          }
        }

        return (
          <Checkbox
            isChecked={formParams[item?.name + '_' + permission?.name]}
            key={permission?.name}
            name={item?.name + '_' + permission?.name}
            onChange={(e) => handleOnChange(e, 'parent')}
            isDisabled={permission?.grantedProviders[0]?.providerName === 'R'}
          >
            {permission?.displayName}{' '}
            {permission?.grantedProviders[0]?.providerName === 'R'
              ? ' (R)'
              : ''}
          </Checkbox>
        );
      }
    });
  };

  const renderTabContent = () => {
    return userPermissions?.groups.map((item: IPermissionList) => {
      if (!(item?.name in allAndSuperPermissions)) {
        allAndSuperPermissions[item?.name] = false;

        quantityCheckbox[item?.name] = item?.permissions.length ?? 0;
        quantityCheckbox[item?.name + 'Checked'] = 0;

        quantityCheckbox['All'] += item?.permissions.length ?? 0;
      }

      return (
        <TabPanel p={2} key={item?.name} ml={10}>
          <Box>
            <Text as="h3" style={{ fontWeight: 'bold' }}>
              {item?.displayName}
            </Text>
            <Divider my={2}></Divider>
          </Box>

          <Box>
            <Checkbox
              isChecked={allAndSuperPermissions[item?.name]}
              isIndeterminate={
                quantityCheckbox[item?.name + 'Checked'] > 0 &&
                quantityCheckbox[item?.name + 'Checked'] <
                  quantityCheckbox[item?.name]
                  ? true
                  : false
              }
              name={item?.name}
              onChange={(e) => handleOnChange(e, 'super')}
            >
              Select All
            </Checkbox>
            <Divider my={2}></Divider>
          </Box>

          <CheckboxGroup>
            <Stack gap="var(--chakra-space-1)">
              {renderTabContentBody(item)}
            </Stack>
          </CheckboxGroup>
        </TabPanel>
      );
    });
  };

  const handleOpenConfirmForm = () => {
    isChangeFormParams() ? setIsOpenConfirmModal(true) : onClose();
  };

  return (
    <>
      <form
        style={{ width: '100%', marginBottom: '20px' }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box my={1}>
          <Checkbox
            isChecked={allAndSuperPermissions['All']}
            isIndeterminate={
              quantityCheckbox['AllChecked'] > 0 &&
              quantityCheckbox['AllChecked'] < quantityCheckbox['All']
                ? true
                : false
            }
            name="all"
            onChange={(e) => handleOnChange(e, 'All')}
          >
            Grant all permissions
          </Checkbox>

          <Divider my={2}></Divider>
        </Box>

        <Box>
          <Tabs orientation="vertical" variant="unstyled">
            <TabList>{renderTabList()}</TabList>

            <TabPanels>{renderTabContent()}</TabPanels>
          </Tabs>
        </Box>

        <Divider my={2}></Divider>

        <Box mb={3} mt={2} float="right">
          <Button
            colorScheme="gray"
            color="gray"
            onClick={handleOpenConfirmForm}
            mr={4}
          >
            Cancel
          </Button>

          <Button
            background="blue.400"
            color="white"
            type="submit"
            isLoading={isLoading}
          >
            Submit
          </Button>
        </Box>
      </form>
      {isOpenConfirmModal && (
        <ConfirmModal
          isOpen={isOpenConfirmModal}
          onClose={onCloseModal}
          onConfirm={onConfirmModal}
          confirmHeader="Are you sure?"
          confirmBody="You have unsaved changes."
        />
      )}
    </>
  );
};

export default PermissionForm;
