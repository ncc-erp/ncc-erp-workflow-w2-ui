import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { formatDate } from 'utils';
import styles from './styles.module.scss';
import { ColorThemeMode } from 'common/constants';
import classNames from 'classnames';

interface ICardDetails {
  title: string;
  date: string;
  link: string;
  isUsed?: boolean;
}

export const CardDetails = ({
  title,
  date,
  link,
  isUsed = false,
}: ICardDetails) => {
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);

  return (
    <div>
      <Box
        className={styles.card}
        bg={bg}
        onClick={() => window.open(link, '_blank')}
      >
        <Text className={styles.title} color={color}>
          Title
        </Text>
        <Text className={styles.small} color={color}>
          {title}
        </Text>
        <Text className={styles.title} color={color}>
          Date
        </Text>
        <Text className={styles.small} color={color}>
          {formatDate(date)}
        </Text>

        <div
          className={classNames(styles.goCorner, { [styles.usedPost]: isUsed })}
        >
          <div className={styles.goArrow}>→</div>
        </div>
      </Box>
    </div>
  );
};
