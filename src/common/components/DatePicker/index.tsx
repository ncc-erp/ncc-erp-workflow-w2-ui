import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './style.module.scss';

interface CustomDatePickerProps {
  inputDate: Date;
  onChange: (date: Date) => void;
}

export const CustomDatePicker = ({
  inputDate,
  onChange,
}: CustomDatePickerProps) => {
  return (
    <DatePicker
      className={styles.datePicker}
      selected={inputDate}
      onChange={(date: Date) => onChange(date)}
      dateFormat="dd/MM/yyyy"
      wrapperClassName={styles.wrapperCustom}
    />
  );
};
