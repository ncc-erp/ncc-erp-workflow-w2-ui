import React, { useMemo } from 'react';
import { Badge, ButtonProps } from '@chakra-ui/react';
import { renderColor } from 'utils/getColorTypeRequest';
import { Color } from 'common/types';

interface BadgeProps extends ButtonProps {
  label: string;
}

const BadgeType: React.FC<BadgeProps> = ({ label }) => {
  const color: Color = useMemo(() => {
    return renderColor(label) || '#000000';
  }, [label]);

  return (
    <Badge
      display="flex"
      alignItems="center"
      gap={2}
      borderRadius={'full'}
      bgColor={'transparent'}
      padding={'4px 8px'}
      style={{ border: `2px solid ${color}` }}
    >
      <span
        style={{
          color: color,
          fontWeight: 'bold',
          fontSize: '12px',
          lineHeight: '18px',
        }}
      >
        {label}
      </span>
    </Badge>
  );
};

export default BadgeType;
