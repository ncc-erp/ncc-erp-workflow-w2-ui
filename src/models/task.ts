import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from '@tanstack/react-query';
import { ListResult } from './request';

export type TaskResult = ListResult<ITask>;
export type StakeHolderResult = ListResult<IStakeHolder>;

export interface ITask {
  name: string;
  email: string;
  emailTo: string[];
  reason?: string;
  status: number;
  workflowInstanceId: string;
  creationTime: string;
  id: string;
  otherActionSignals?: IOtherActionSignals[];
  description?: string;
  authorName?: string;
}

export interface IStakeHolder {
  name: string;
  email: string;
}

export interface IOtherActionSignals {
  otherActionSignal: string;
  status: number;
}

export interface FilterTasks {
  status?: number;
  workflowDefinitionId?: string;
  maxResultCount: number;
  skipCount: number;
  keySearch?: string;
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
  emailTo: Array<string>;
  otherActionSignals: IOtherActionSignals[];
}

export type FetchNextPageFunction = (
  options?: FetchNextPageOptions | undefined
) => Promise<InfiniteQueryObserverResult<ITaskResponse, unknown>>;

export type Refetch = <TPageData>(
  options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
) => Promise<QueryObserverResult<InfiniteData<ITaskResponse>, unknown>>;

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
