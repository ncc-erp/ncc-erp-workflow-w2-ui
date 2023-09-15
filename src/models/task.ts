import { ListResult } from './request';

export type TaskResult = ListResult<ITask>;

export interface ITask {
  name: string;
  email: string;
  reason?: string;
  status: number;
  workflowInstanceId: string;
  id: string;
}

export interface FilterTasks {
  status?: number;
  maxResultCount: number;
  skipCount: number;
}
