import { Color } from 'common/types';

const arrColor: Color[] = ['#009688', '#000000'];
const initialData: [string, Color][] = [
  ['Device Request', '#175CD3'],
  ['Change Office Request', '#C11574'],
  ['Office Equipment Request', '#0DBE9E'],
  ['Probationary Confirmation Request', '#58880A'],
  ['WFH Request', '#7F56D9'],
];
let currentColor: number = 0;
const hashMap = new Map<string, Color>(initialData);

export const renderColor = (key: string) => {
  if (hashMap.has(key)) {
    return hashMap.get(key);
  }
  if (currentColor > arrColor.length - 1) {
    return '#3366CC';
  }

  hashMap.set(key, arrColor[currentColor]);
  currentColor++;
  return hashMap.get(key);
};
