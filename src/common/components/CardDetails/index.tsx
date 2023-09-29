import { Box, Text } from '@chakra-ui/react';
import { formatDate } from 'utils';
import styles from './styles.module.scss';

interface ICardDetails {
  title: string;
  date: string;
  link: string;
}

export const CardDetails = ({ title, date, link }: ICardDetails) => {
  return (
    <div>
      <Box className={styles.card} onClick={() => window.open(link, '_blank')}>
        <Text className={styles.title}>Title</Text>
        <p className={styles.small}>{title}</p>
        <Text className={styles.title}>Date</Text>
        <p className={styles.small}>{formatDate(date)}</p>
        <div className={styles.goCorner}>
          <div className={styles.goArrow}>→</div>
        </div>
      </Box>
    </div>
  );
};
