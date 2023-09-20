import { ITaskResponse } from 'models/task';

export const getAllTaskPagination = (data: ITaskResponse[]) => {
  return data.reduce(
    (result, obj) => {
      return {
        items: [...result.items, ...obj.items],
        totalCount: obj.totalCount,
      };
    },
    { items: [], totalCount: 0 }
  );
};
