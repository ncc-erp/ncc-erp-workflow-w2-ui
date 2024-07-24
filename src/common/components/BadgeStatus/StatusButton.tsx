import React from 'react';
import { Badge, ButtonProps } from '@chakra-ui/react';
import PendingIcon from 'utils/icons/Pending';
import CheckIcon from 'utils/icons/Check';
import CloseIcon from 'utils/icons/Close';
import styles from './style.module.scss';
import CancelIcon from 'utils/icons/Cancel';

interface BadgeButtonProps extends ButtonProps {
  status: 'Approved' | 'Rejected' | 'Pending' | 'Canceled' | 'Faulted';
}

const BadgeStatus: React.FC<BadgeButtonProps> = ({
  status,
  children,
  ...props
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Pending':
        return {
          backgroundColor: '#FFFAEB',
          color: '#B54708',
          border: '#FEDF89',
        };
      case 'Approved':
        return {
          backgroundColor: '#ECFDF3',
          color: '#067647',
          border: '#ABEFC6',
        };
      case 'Rejected':
      case 'Faulted':
        return {
          backgroundColor: '#FEF3F2',
          color: '#B42318',
          border: '#FECDCA',
        };
      case 'Canceled':
        return {
          backgroundColor: '#F9FAFB',
          color: '#667085',
          border: '#EAECF0',
        };
      default:
        return {
          backgroundColor: '#EAECF0',
          color: '#344054',
          border: '#D3DCE6',
        };
    }
  };

  const renderIcon = (color: string) => {
    switch (status) {
      case 'Pending':
        return <PendingIcon color={color} className={styles.spin} />;
      case 'Approved':
        return <CheckIcon color={color} />;
      case 'Rejected':
      case 'Faulted':
        return <CloseIcon color={color} />;
      case 'Canceled':
        return <CancelIcon color={color} />;
      default:
        return null;
    }
  };

  const style = getBadgeStyle();

  return (
    <Badge
      {...props}
      display="flex"
      alignItems="center"
      gap={2}
      borderRadius={'full'}
      bgColor={style.backgroundColor}
      padding={'4px 8px'}
      style={{ border: `1px solid ${style.color}` }}
    >
      {renderIcon(style.color)}
      <span style={{ color: style.color }}>{children}</span>
    </Badge>
  );
};

export default BadgeStatus;
