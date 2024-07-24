import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import styles from './style.module.scss';
import { RequestTemplateResult } from 'models/request';
import { useMemo } from 'react';
import { IUser, UserInfo } from 'models/user';
import { IOffices } from 'models/office';
import { ICurrentProject, IProjects } from 'models/project';
import RequestForm from './RequestForm';
import { CustomButton } from '../Button/Button';

interface ModalTabsRequestProps {
  isOpen: boolean;
  onClose: () => void;
  data: RequestTemplateResult;
  users: IUser[] | undefined;
  offices: IOffices[] | undefined;
  userInfo: UserInfo | undefined;
  projects: IProjects[] | undefined;
  userCurrentProject: ICurrentProject | undefined;
}

export const ModalTabsRequest = ({
  isOpen,
  onClose,
  data,
  users,
  offices,
  userInfo,
  projects,
  userCurrentProject,
}: ModalTabsRequestProps) => {
  const listInputDefinition = useMemo(() => {
    return data?.items || [];
  }, [data]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <ModalHeader>
          <Box className={styles.ModalHeader}>Create Request</Box>
          <Box className={styles.ModalDescription}>
            Create a request and wait for PM approval
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="unstyled">
            <TabList>
              {listInputDefinition.map((item, index) => (
                <Tab key={index}>{item.displayName}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {listInputDefinition.map((item, index) => (
                <TabPanel key={index}>
                  <RequestForm
                    inputDefinition={item.inputDefinition}
                    users={users}
                    offices={offices}
                    userInfo={userInfo}
                    projects={projects}
                    userCurrentProject={userCurrentProject}
                    onCloseModal={onClose}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter style={{ display: 'flex', gap: '8px' }}>
          <CustomButton size={'sm'} variant="brandSecondary">
            Cancel
          </CustomButton>
          <CustomButton size={'sm'} variant="brandPrimary">
            Submit
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
