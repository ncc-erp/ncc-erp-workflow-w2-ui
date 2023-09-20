import { ListResult } from './request';

export type TaskResult = ListResult<ITask>;
export type StakeHolderResult = ListResult<IStakeHolder>;

export interface ITask {
  name: string;
  email: string;
  reason?: string;
  status: number;
  workflowInstanceId: string;
  creationTime?: string;
  id: string;
}

export interface IStakeHolder {
  name: string;
  email: string;
}

export interface FilterTasks {
  status?: number;
  workflowDefinitionId?: string;
  maxResultCount: number;
  skipCount: number;
}

export interface IRequestUser {
  email: string;
  name: string;
  branchName: string;
}

export interface IRequest {
  CurrentOffice: string;
  Project?: string;
  Device?: string;
  Reason?: string;
  Dates?: string;
  Equipment?: string;
  DestinationOffice?: string;
  Content?: string;
  StartDate?: string;
  EndDate?: string;
}

export interface IInputRequest {
  Request: IRequest;
  RequestUser: IRequestUser;
}

export interface ITaskResult {
  input: IInputRequest;
  tasks: ITask;
}
