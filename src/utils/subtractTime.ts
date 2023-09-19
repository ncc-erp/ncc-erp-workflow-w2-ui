import { UnitTime } from 'common/constants';
import { format } from 'date-fns';

const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
const millisecondsInMonth = 30 * 24 * 60 * 60 * 1000;
const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;

const unitToMilliseconds = {
  [UnitTime.WEEK]: millisecondsInWeek,
  [UnitTime.MONTH]: millisecondsInMonth,
  [UnitTime.YEAR]: millisecondsInYear,
};
const defaultUnit = Object.keys(unitToMilliseconds);

export function subtractTime(unit: string, amount: number) {
  const findUnit = defaultUnit.find((e) => e.includes(unit));
  if (!findUnit) {
    throw new Error(`Invalid unit: ${unit}`);
  }

  const currentDate = new Date();
  const previousDate = format(
    new Date(currentDate.getTime() - amount * unitToMilliseconds[findUnit]),
    'MM/dd/yyyy'
  );

  return previousDate;
}
