import { Box, Button, ButtonProps, Text } from '@chakra-ui/react';
import CheckIcon from 'utils/icons/Check';

interface MenuItemStatusProps extends ButtonProps {
  status: 'All' | 'Approved' | 'Pending' | 'Rejected' | 'Cancel';
  isSelected?: boolean;
}

const MenuItemStatus: React.FC<MenuItemStatusProps> = ({
  status,
  isSelected,
  ...props
}) => {
  const getColorStyle = () => {
    switch (status) {
      case 'Pending':
        return {
          color: '#B54708',
          border: '#B54708',
        };
      case 'Approved':
        return {
          color: '#067647',
          border: '#067647',
        };
      case 'Rejected':
        return {
          color: '#B42318',
          border: '#B42318',
        };
      case 'Cancel':
        return {
          color: '#667085',
          border: '#667085',
        };
      default:
        return {
          color: '#ffffff',
          border: '#667085',
        };
    }
  };

  const { color, border } = getColorStyle();

  const bgColor = isSelected ? '#F9FAFB' : '#ffffff';

  return (
    <Button
      display="flex"
      alignItems="center"
      justifyContent={'flex-start'}
      gap={2}
      w={'168px'}
      h={'44px'}
      {...props}
      _hover={{
        bg: '#F9FAFB',
      }}
      position={'relative'}
      bgColor={bgColor}
    >
      <Box
        bgColor={color}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '4px',
          border: `1px solid ${border}`,
        }}
      />
      <Text
        fontWeight={500}
        fontSize={'16px'}
        lineHeight={'24px'}
        color={'#101828'}
      >
        {status}
      </Text>
      {isSelected && (
        <Box
          position={'absolute'}
          right={'16px'}
          top={'50%'}
          transform={'translateY(-50%)'}
        >
          <CheckIcon width={'20px'} height={'20px'} color="#344054" />
        </Box>
      )}
    </Button>
  );
};

export default MenuItemStatus;
