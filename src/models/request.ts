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
  settingDefinition: SettingDefinition
  id: string;
}

export interface InputDefinition {
  workflowDefinitionId: string;
  propertyDefinitions: PropertyDefinition[];
  id: string;
}
export interface SettingDefinition {
  workflowDefinitionId: string;
  propertyDefinitions: PropertyDefinitionSetting[];
  id: string;
}

export interface PropertyDefinitionSetting {
  key: string;
  value: string;
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

export interface IRequestUser {
  email: string;
  name: string;
  branchName: string;
}

export interface IInputRequest {
  Request: Record<string, Record<string, string> | string>;
  RequestUser: IRequestUser;
}

export interface IOtherActionSignals {
  otherActionSignal: string;
  status: number;
}

export interface ITask {
  name: string;
  email: string;
  emailTo: string[];
  reason?: string;
  status: number;
  workflowInstanceId: string;
  dynamicActionData?: string;
  creationTime: string;
  id: string;
  otherActionSignals?: IOtherActionSignals[];
  description?: string;
  authorName?: string;
}

export interface IRequestResult {
  typeRequest: string;
  input: IInputRequest;
  tasks: ITask[];
  workInstanceId: string;
}
