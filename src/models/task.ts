import { ListResult } from './request';

export type TaskResult = ListResult<ITask>;
export type StakeHolderResult = ListResult<IStakeHolder>;

export interface ITask {
  name: string;
  email: string;
  reason?: string;
  status: number;
  workflowInstanceId: string;
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
