import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import { ListResult } from './request';

export type TaskResult = ListResult<ITask>;

export interface ITask {
  name: string;
  email: string;
  reason?: string;
  status: number;
  workflowInstanceId: string;
  creationTime: string;
  id: string;
  authorName?: string;
}

export interface FilterTasks {
  status?: number;
  workflowDefinitionId?: string;
  maxResultCount: number;
  skipCount: number;
  email?: string;
  dates?: string;
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
  Request: Record<string, Record<string, string> | string>;
  RequestUser: IRequestUser;
}

export interface ITaskResult {
  input: IInputRequest;
  tasks: ITask;
}

export type FetchNextPageFunction = (
  options?: FetchNextPageOptions | undefined
) => Promise<InfiniteQueryObserverResult<ITaskResponse, unknown>>;

export interface ICountTask {
  countPending: number;
  countApproved: number;
  countRejected: number;
}

export interface ITaskRequest {
  maxResultCount: number;
  skipCount: number;
}

export interface ITaskResponse {
  items: ITask[];
  totalCount: number;
}

export interface IInfinityTaskResponse {
  pageParams: number[];
  pages: ITaskPage[];
}

export interface ITaskPage {
  data: ITaskResponse;
}
