import DatePicker from 'react-datepicker';
import styles from './styles.module.scss';
import { Box, Text } from '@chakra-ui/react';
import { FaCalendar } from 'react-icons/fa';
import classNames from 'classnames';

interface IDateRangePickerProps {
  startDate: Date | null;
  handleStartDateChange: (date: Date) => void;
  endDate: Date | null;
  handleEndDateChange: (date: Date) => void;
  isDisabled: boolean;
  endDatePicker: React.LegacyRef<DatePicker<never, undefined>> | undefined;
}

const DateRangePicker = ({
  startDate,
  handleStartDateChange,
  endDate,
  handleEndDateChange,
  endDatePicker,
  isDisabled,
}: IDateRangePickerProps) => {
  return (
    <Box width={'auto'} display="flex" gap="6px" alignItems="center">
      <div style={{ width: '18px', height: '18px' }}>
        <FaCalendar className={styles.icon} />
      </div>
      <Text ml={2} mr={1} fontSize="sm">
        From
      </Text>
      <DatePicker
        disabled={isDisabled}
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
        className={classNames(styles.datePicker, {
          [styles.disabled]: isDisabled,
        })}
        dateFormat="dd/MM/yyyy"
        isClearable
        clearButtonClassName={styles.btnClear}
        onChangeRaw={(e) => e.preventDefault()}
      />
      <Text mx={1} fontSize="sm">
        To
      </Text>
      <DatePicker
        disabled={isDisabled || !startDate}
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="End Date"
        className={classNames(styles.datePicker, {
          [styles.disabled]: isDisabled || !startDate,
        })}
        dateFormat="dd/MM/yyyy"
        ref={endDatePicker}
        onChangeRaw={(e) => e.preventDefault()}
      />
    </Box>
  );
};

export default DateRangePicker;
