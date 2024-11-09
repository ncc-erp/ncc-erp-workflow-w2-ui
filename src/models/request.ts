import { RequestStatus } from 'common/enums';

export interface Request {
  id: string;
  workflowDefinitionId: string;
  workflowDefinitionDisplayName: string;
  settings?: string;
  userRequestName: string;
  createdAt: string;
  lastExecutedAt: string;
  shortTitle?: string;
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
  defineJson: string;
  id: string;
}

export interface InputDefinition {
  workflowDefinitionId: string;
  propertyDefinitions: PropertyDefinition[];
  settings?: Settings;
  id: string;
  nameRequest?: string;
  requestDisplayName?: string;
  defineJson: string | IDefineJsonObject;
}

export interface IDefineJsonObject {
  definitionId: string;
}

export interface Settings {
  color: string;
  titleTemplate: string;
}

export interface IJsonObject {
  settings: Settings;
  propertyDefinitions: PropertyDefinition[];
  defineJson?: string | IDefineJsonObject;
}

export interface PropertyDefinition {
  name: string;
  type: string;
  isRequired: boolean;
  isTitle?: boolean;
  titleTemplate?: string;
}

export interface CreateWorkflowPropertyDefinition {
  name: string;
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

export interface ICreateFormParams {
  name: string;
  displayName: string;
  tag: string;
  workflowCreateData?: IJsonObject;
}

export interface IUpdateInputFormParams {
  id: string;
  workflowDefinitionId?: string;
  propertyDefinitions: PropertyDefinition[];
  defineJson?: string | IDefineJsonObject;
  settings?: Settings;
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
  updatedBy?: string;
}

export interface IRequestResult {
  typeRequest: string;
  input: IInputRequest;
  tasks: ITask[];
  workInstanceId: string;
}
