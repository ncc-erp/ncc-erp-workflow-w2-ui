import { Box } from '@chakra-ui/react';
import ChevronDownIcon from 'utils/icons/ChevronDown';

interface UserButtonProps {
  name?: string;
  email?: string;
}
export const UserButton = ({
  name = 'User',
  email = 'a.nguyenvan@gmail.com',
}: UserButtonProps) => {
  return (
    <Box display={'flex'} gap={'6px'} alignItems={'center'}>
      <Box display={'flex'} gap={'4px'} flexDirection={'column'}>
        <Box
          fontSize={'14px'}
          lineHeight={'18px'}
          fontWeight={600}
          color="#ECE9EB"
        >
          {name}
        </Box>
        <Box
          fontSize={'10px'}
          lineHeight={'14px'}
          fontWeight={400}
          color="#C7BEC4"
        >
          {email}
        </Box>
      </Box>
      <ChevronDownIcon />
    </Box>
  );
};
