import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import styles from './styles.module.scss';
import { Box } from '@chakra-ui/react';
import classNames from 'classnames';
import { ComponentProps } from 'react';

type DatePickerProps = Pick<
  ReactDatePickerProps,
  'className' | 'wrapperClassName'
>;

type IDateRangePickerProps = {
  startDate: Date | null;
  handleStartDateChange: (date: Date) => void;
  endDate: Date | null;
  handleEndDateChange: (date: Date) => void;
  isDisabled: boolean;
  endDatePicker: React.LegacyRef<DatePicker<never, undefined>> | undefined;
  startDateProps?: DatePickerProps;
  endDateProps?: DatePickerProps;
} & ComponentProps<typeof Box>;

const DateRangePicker = ({
  startDate,
  handleStartDateChange,
  endDate,
  handleEndDateChange,
  endDatePicker,
  isDisabled,
  startDateProps: providedStartDateProps,
  endDateProps: providedEndDateProps,
  ...wrapperProps
}: IDateRangePickerProps) => {
  const { className: sdClass, ...sdProps } = providedStartDateProps ?? {};
  const { className: edClass, ...edPRops } = providedEndDateProps ?? {};

  return (
    <Box
      width={'auto'}
      display="flex"
      gap={'1rem'}
      alignItems="center"
      {...wrapperProps}
    >
      <DatePicker
        disabled={isDisabled}
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
        enableTabLoop={false}
        className={classNames(
          styles.datePicker,
          {
            [styles.disabled]: isDisabled,
          },
          sdClass
        )}
        dateFormat="dd/MM/yyyy"
        isClearable
        clearButtonClassName={styles.btnClear}
        onChangeRaw={(e) => e.preventDefault()}
        {...sdProps}
      />
      <DatePicker
        disabled={isDisabled || !startDate}
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        enableTabLoop={false}
        minDate={startDate}
        placeholderText="End Date"
        className={classNames(
          styles.datePicker,
          {
            [styles.disabled]: isDisabled || !startDate,
          },
          edClass
        )}
        dateFormat="dd/MM/yyyy"
        ref={endDatePicker}
        onChangeRaw={(e) => e.preventDefault()}
        {...edPRops}
      />
    </Box>
  );
};

export default DateRangePicker;
