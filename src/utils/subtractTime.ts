import { UnitTime } from 'common/constants';
import { add } from 'date-fns';
import { formatDate } from './formatDate';

const millisecondsInWeek = add(new Date(0), { weeks: 1 }).getTime();
const millisecondsInMonth = add(new Date(0), { months: 1 }).getTime();
const millisecondsInYear = add(new Date(0), { years: 1 }).getTime();

const unitToMilliseconds = {
  [UnitTime.WEEK]: millisecondsInWeek,
  [UnitTime.MONTH]: millisecondsInMonth,
  [UnitTime.YEAR]: millisecondsInYear,
};
const defaultUnit = Object.keys(unitToMilliseconds);

export function subtractTime(unit: string, amount: number) {
  const findUnit = defaultUnit.find((e) =>
    e.toLowerCase().includes(unit.toLowerCase())
  );
  if (!findUnit) {
    throw new Error(`Invalid unit: ${unit}`);
  }
  const formatDateToGetApi = 'MM/dd/yyyy';
  const currentDate = new Date();
  const previousDate = formatDate(
    new Date(currentDate.getTime() - amount * unitToMilliseconds[findUnit]),
    formatDateToGetApi
  );

  return previousDate;
}
