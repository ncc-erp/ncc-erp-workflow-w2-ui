import axios, { useAxios } from 'api/axiosInstant';
import { AxiosRequestConfig } from 'axios';
import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import { FilterTasks, ITaskResponse } from 'models/task';

export const useCreate = <T, U>(url: string, config?: AxiosRequestConfig) => {
  const axios = useAxios();

  const mutate = async (params: T) => {
    const data: U = await axios.post(`${url}`, params, config);
    return data;
  };

  return useMutation(mutate);
};

export const useUpdate = <T, D, U>(
  url: string,
  params?: T,
  body?: D,
  config?: AxiosRequestConfig
) => {
  const axios = useAxios();

  const mutate = async () => {
    const data: U = await axios.put(`${url}/${params}`, body, config);
    return data;
  };

  return useMutation(mutate);
};

export const useGetOne = <T>(
  key: QueryKey,
  url: string,
  config?: AxiosRequestConfig
) => {
  const axios = useAxios();

  const getData = async () => {
    const data: T = await axios.get(`${url}`, config);
    return data;
  };

  return useQuery(key, () => getData());
};

export const useGetList = <T, D = object | string>(
  key: QueryKey,
  url: string,
  params?: D,
  options?: {
    enabled: boolean;
  },
  config?: AxiosRequestConfig
) => {
  const axios = useAxios();

  const getData = async () => {
    const data: T = await axios.get(`${url}`, { params, ...config });
    return data;
  };

  return useQuery(key, getData, options);
};

export const useGetListByPost = <T, D = object>(
  key: QueryKey,
  url: string,
  filter?: D,
  config?: AxiosRequestConfig,
  options?: object
) => {
  const axios = useAxios();

  const getData = async () => {
    const data: T = await axios.post(`${url}`, filter, config);
    return data;
  };

  return useQuery(key, () => getData(), options);
};

export const useDelete = (url: string) => {
  const axios = useAxios();

  const mutate = async (params: string) => {
    await axios.delete(`${url}/${params}`);
  };

  return useMutation(mutate);
};

export const useCancelByPost = (url: string) => {
  const axios = useAxios();

  const mutate = async (params: string) => {
    await axios.post(`${url}/${params}/cancel`);
  };

  return useMutation(mutate);
};

export const useUpdateStatus = (url: string, status: string) => {
  const axios = useAxios();

  const mutate = async (params: string) => {
    await axios.post(`${url}/${params}/${status}`);
  };

  return useMutation(mutate);
};

export const useTaskActions = (url: string = '/app/task') => {
  const axios = useAxios();

  const mutate = async (params: { id: string; action: string }) => {
    await axios.post(`${url}/action`, params);
  };

  return useMutation(mutate);
};

export const useRejectedTask = (url: string) => {
  const axios = useAxios();

  const mutate = async (params: { id: string; reason: string }) => {
    await axios.post(`${url}/${params.id}/reject?reason=${params.reason}`);
  };

  return useMutation(mutate);
};

export const getAllTask = async (filter: FilterTasks) => {
  const result: ITaskResponse = await axios.post('app/task/list', filter);
  return result;
};
