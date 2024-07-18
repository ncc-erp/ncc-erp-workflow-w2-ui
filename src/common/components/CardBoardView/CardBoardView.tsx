import { Box, Flex } from '@chakra-ui/react';
import TextToolTip from '../textTooltip';
import { ITask } from 'models/task';
import BadgeType from '../BadgeType/BadgeType';
import { formatDateTask } from 'utils/dateUtils';

interface CardBoardViewProps {
  task: ITask;
}

const CardBoardView = ({ task, ...props }: CardBoardViewProps) => {
  const formatShortId = (id: string) => {
    return id.slice(0, 5);
  };

  return (
    <Flex
      {...props}
      alignItems={'flex-start'}
      flexDirection={'column'}
      gap={'12px'}
      padding={'12px'}
      borderRadius={'6px'}
      border={'1px solid #EAECF0'}
      w={'386.67px'}
      shadow={'md'}
    >
      <Box>
        <TextToolTip
          maxLines={1}
          title={task.title}
          id={formatShortId(task.id)}
          type="BOARD"
        />
        <Box
          fontWeight={'400'}
          fontSize={'14px'}
          lineHeight={'20px'}
          color={'#475467'}
        >
          {formatDateTask(task?.creationTime)}
        </Box>
      </Box>
      <Flex w={'100%'} alignItems={'center'} justifyContent={'space-between'}>
        <Box
          color={'#475467'}
          fontWeight={'400'}
          fontSize={'14px'}
          lineHeight={'20px'}
        >
          Created by:
        </Box>
        <Box
          fontWeight={'600'}
          fontSize={'14px'}
          lineHeight={'20px'}
          color={'#344054'}
        >
          {task.authorName}
        </Box>
      </Flex>
      <Flex w={'100%'} alignItems={'center'} justifyContent={'space-between'}>
        <Box
          fontWeight={'400'}
          fontSize={'14px'}
          lineHeight={'20px'}
          color={'#475467'}
        >
          Current State:
        </Box>
        <Box
          fontWeight={'600'}
          fontSize={'14px'}
          lineHeight={'20px'}
          color={'#344054'}
        >
          {task.description}
        </Box>
      </Flex>
      <Flex w={'100%'} alignItems={'center'} justifyContent={'space-between'}>
        <Box
          fontWeight={'400'}
          fontSize={'14px'}
          lineHeight={'20px'}
          color={'#475467'}
        >
          Assign:
        </Box>
        <Box
          fontWeight={'600'}
          fontSize={'14px'}
          lineHeight={'20px'}
          color={'#344054'}
        >
          {task.emailTo.map((email) => email.split('@')[0]).join(', ')}
        </Box>
      </Flex>
      <Box paddingTop={'8px'}>
        <BadgeType label={task.name} />
      </Box>
    </Flex>
  );
};

export default CardBoardView;
