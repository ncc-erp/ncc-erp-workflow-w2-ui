import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { ITask } from 'models/request';
import { getStatusByIndex } from 'utils';

interface IRelatedTaskTableProp {
  taskLists: ITask[] | undefined;
}

export const RelatedTaskTable = ({ taskLists }: IRelatedTaskTableProp) => {
  return (
    <Box>
      <TableContainer>
        <Table variant="simple" border="1px solid" borderColor="gray.200">
          <Thead background={'#B0C4DE'}>
            <Tr>
              <Th>Title</Th>
              <Th>Current State</Th>
              <Th>Assigned</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {taskLists
              ? taskLists.map((task) => (
                  <Tr key={task.id}>
                    <Td border="1px solid" borderColor="gray.200">
                      {task.name}
                    </Td>
                    <Td border="1px solid" borderColor="gray.200">
                      {task.description}
                    </Td>
                    <Td border="1px solid" borderColor="gray.200">
                      {task.emailTo?.map((email) => (
                        <div key={email}>{email.split('@')[0]}</div>
                      ))}
                    </Td>
                    <Td border="1px solid" borderColor="gray.200">
                      <TextGroup
                        label=""
                        content={getStatusByIndex(task.status).status}
                        color={getStatusByIndex(task.status).color}
                      />
                    </Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
