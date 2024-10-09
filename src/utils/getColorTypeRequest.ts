import { Color } from 'common/types';

const arrColor: Color[] = ['#009688', '#000000'];
const initialData: [string, Color][] = [
  ['Device Request', '#03A9F4'],
  ['Change Office Request', '#db0000'],
  ['Office Equipment Request', '#f27024'],
  ['Probationary Confirmation Request', '#0c51a0'],
  ['WFH Request', '#d000db'],
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
