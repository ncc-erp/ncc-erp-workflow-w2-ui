import { RequestStatus } from 'common/enums';

export interface Request {
  id: string;
  workflowDefinitionId: string;
  workflowDefinitionDisplayName: string;
  userRequestName: string;
  createdAt: string;
  lastExecutedAt: string;
  status: RequestStatus;
  stakeHolders: string[];
  currentStates: string[];
  creatorId?: string;
}

export interface RequestTemplate {
  id: string;
  displayName: string;
}

export interface FilterRequestParams {
  Status?: string;
  WorkflowDefinitionId?: string;
  maxResultCount: number;
  skipCount: number;
  sorting: string;
  RequestUser?: string;
  StakeHolder?: string;
}

export interface ListResult<T> {
  totalCount: number;
  items: T[];
}

export type FilterRequestResult = ListResult<Request>;

export type RequestTemplateResult = ListResult<RequestTemplate>;

export interface RequestTemplate {
  definitionId: string;
  name: string;
  displayName: string;
  description?: string;
  version: number;
  isSingleton: boolean;
  isPublished: boolean;
  isLatest: boolean;
  inputDefinition: InputDefinition;
  id: string;
}

export interface InputDefinition {
  workflowDefinitionId: string;
  propertyDefinitions: PropertyDefinition[];
  id: string;
}

export interface PropertyDefinition {
  name: string;
  type: string;
  isRequired: boolean;
}

export interface ChangeOfficeRequestFormParams {
  currentOffice: string;
  destinationOffice: string;
  content: string;
  startDate: Date;
  endDate: Date;
}

export interface OfficeEquipmentRequestFormParams {
  currentOffice: string;
  reason: string;
}

export interface WfhRequestFormParams {
  currentOffice: string;
  currentProject: string;
  reason: string;
  date: Date;
}

export interface DeviceRequestFormParams {
  currentOffice: string;
  currentProject: string;
  device: string;
  reason: string;
}

export interface IRequestFormParams {
  workflowDefinitionId?: string;
  input: object;
}
