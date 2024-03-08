import DatePicker from 'react-datepicker';
import styles from './styles.module.scss';
import { Box, Text } from '@chakra-ui/react';
import { FaCalendar } from 'react-icons/fa';
import { isSameDay } from 'date-fns';

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
  const handleDayClassName = (date: Date, selectedDate: Date | null) => {
    // Kiểm tra nếu ngày nhỏ hơn ngày hiện tại và không phải là ngày được chọn
    console.log(date);
    console.log(selectedDate)
    if (date < new Date() || (date < new Date() && selectedDate &&  !isSameDay(date, selectedDate))) {
      return styles['past-date']; // Thêm class 'past-date' để đổi màu sắc
    }
    return null;
  };
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
        dayClassName={(date) => handleDayClassName(date,startDate )}
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
        dayClassName={(date) =>  handleDayClassName(date,endDate )}
        className={`${styles.datePicker} ${!startDate ? styles.disabled : ''}`}
        dateFormat="dd/MM/yyyy"
        ref={endDatePicker}
        onChangeRaw={(e) => e.preventDefault()}
      />
    </Box>
  );
};

export default DateRangePicker;
