import DatePicker from 'react-datepicker';
import styles from './styles.module.scss';
import { Box, Text } from '@chakra-ui/react';
import { FaCalendar } from 'react-icons/fa';

interface IDateRangePickerProps {
  startDate: Date | null;
  handleStartDateChange: (date: Date) => void;
  endDate: Date | null;
  handleEndDateChange: (date: Date) => void;
  endDatePicker: React.LegacyRef<DatePicker<never, undefined>> | undefined;
}

const DateRangePicker = ({
  startDate,
  handleStartDateChange,
  endDate,
  handleEndDateChange,
  endDatePicker,
}: IDateRangePickerProps) => {
  return (
    <Box width={'auto'} display="flex" gap={'3px'} alignItems="center">
      <div style={{ width: '16px', height: '16px' }}>
        <FaCalendar className={styles.icon} />
      </div>
      <Text ml={2} mr={2} fontSize="sm">
        From
      </Text>
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
        className={styles.datePicker}
        dateFormat="dd/MM/yyyy"
        isClearable
        clearButtonClassName={styles.btnClear}
        onChangeRaw={(e) => e.preventDefault()}
      />
      <Text mr={2} fontSize="sm">
        To
      </Text>
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="End Date"
        className={`${styles.datePicker} ${!startDate ? styles.disabled : ''}`}
        dateFormat="dd/MM/yyyy"
        ref={endDatePicker}
        onChangeRaw={(e) => e.preventDefault()}
      />
    </Box>
  );
};

export default DateRangePicker;
