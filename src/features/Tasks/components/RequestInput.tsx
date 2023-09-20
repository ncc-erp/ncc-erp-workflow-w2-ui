import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { dateFormat } from 'common/constants';
import { parse, isValid } from 'date-fns';

interface IRequestProps {
  inputRequestDetail: Record<string, Record<string, string> | string>;
}

const convertToTitleCase = (inputString: string) => {
  return inputString
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const parseDateStrings = (dateStrings: string) => {
  const dateArray = dateStrings
    .split(',')
    .map((dateString) => dateString.trim());
  const validDates: string[] = [];
  const invalidDates: string[] = [];

  dateArray.forEach((dateString) => {
    const isValidFormat =
      isValid(parse(dateString, dateFormat.ddMMyyyy, new Date())) ||
      isValid(parse(dateString, dateFormat.yyyyMMdd, new Date()));
    if (isValidFormat) {
      validDates.push(dateString);
    } else {
      invalidDates.push(dateString);
    }
  });

  if (invalidDates.length === 0) {
    return validDates;
  }
  return undefined;
};

export const RequestInput = ({ inputRequestDetail }: IRequestProps) => {
  const TextGroupRequest = Object.keys(inputRequestDetail).map((key) => {
    const value = inputRequestDetail[key];

    if (typeof value === 'object' && value !== null) {
      const { displayName } = value as { displayName?: string };
      if (displayName) {
        return (
          <TextGroup
            key={key}
            label={convertToTitleCase(key)}
            content={displayName}
          />
        );
      }
    } else {
      const dates = parseDateStrings(value);
      return (
        <TextGroup
          key={key}
          label={convertToTitleCase(key)}
          content={value}
          dates={dates}
        />
      );
    }
  });

  return <>{TextGroupRequest}</>;
};
