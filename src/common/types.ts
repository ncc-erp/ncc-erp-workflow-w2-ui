export interface option {
  value: string | number;
  label: string | number;
}

export type TFilterTask =
  | 'status'
  | 'workflowDefinitionId'
  | 'dates'
  | 'emailRequest'
  | 'emailAssign';

export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;
export type Color = RGB | RGBA | HEX;

// type Maximum_Color = 256;
// type ComputedRange<N extends number, Result extends Array<unknown> = []> = 
// (
//   Result['length'] extends N?
//   Result:
//   ComputedRange<N, [...Result,Result['length']]>
// )
  
// type FromZeroTo256 = ComputedRange<Maximum_Color>[number];
// type alpha = 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9
// type RGB = `rgb(${FromZeroTo256}, ${FromZeroTo256}, ${FromZeroTo256})`;
// type RGBA = `rgba(${FromZeroTo256}, ${FromZeroTo256}, ${FromZeroTo256}, ${alpha})`;

// type HexLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
// type HexDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
// type HexPart = HexLetter | HexDigit;
// type HexEncodedNumber = `${HexPart}${HexPart}`;
// type HexCodeShort = `${HexPart}${HexPart}${HexPart}`;
// type HexCodeClassic = `${HexEncodedNumber}${HexEncodedNumber}${HexEncodedNumber}`;
// type HexCodeWithAlpha = `${HexCodeClassic}${HexEncodedNumber}`;
// type HexCodeModern = HexCodeShort | HexCodeClassic | HexCodeWithAlpha;

// type HEX = `#${HexCodeModern}`;

// export type Color = RGB | RGBA | HEX;


