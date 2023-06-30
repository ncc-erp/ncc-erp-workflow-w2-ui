export interface IPropertyDefinition {
  name: string;
  type: string;
  isRequired: boolean;
}

export interface IFormRequest {
  CurrentOffice: string;
  DestinationOffice: string;
  Content: string;
  StartDate: string;
  EndDate: string;
  Device: string;
  Project: string;
  Reason: string;
  Equipment: string;
  Dates: string;
}

export type FormField =
  | "CurrentOffice"
  | "DestinationOffice"
  | "Content"
  | "StartDate"
  | "EndDate"
  | "Device"
  | "Project"
  | "Reason"
  | "Equipment"
  | "Dates";
