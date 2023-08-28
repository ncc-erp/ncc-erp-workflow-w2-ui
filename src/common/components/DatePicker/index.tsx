import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

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
      className="datePicker"
      selected={inputDate}
      onChange={(date: Date) => onChange(date)}
    />
  );
};
