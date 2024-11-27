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
    const data: U = await axios.put(
      `${params ? url + '/' + params : url}`,
      body,
      config
    );
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

export const useFetchGithubReleasePage = <T>(key: QueryKey) => {
  const getData = async () => {
    const response = await fetch(`/git`, {});
    return response.json();
  };

  return useQuery<T>(key, () => getData());
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

export const useDelete = (url: string, mergeParams: boolean = false) => {
  const axios = useAxios();

  const mutate = async (params: string) => {
    await axios.delete(`${url}${mergeParams ? '?' + params : '/' + params}`);
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

  const mutate = async (params: {
    id: string;
    dynamicActionData?: string | null | undefined;
  }) => {
    await axios.post(`${url}/${status}`, params);
  };

  return useMutation(mutate);
};

export const useGetDynamicDataTask = (url: string, status: string) => {
  const axios = useAxios();

  const mutate = async (params: { id: string; workflowInstanceId: string }) => {
    const result = await axios.post(`${url}/${status}`, params);
    return result;
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

export const useUpdateRoles = (url: string) => {
  const axios = useAxios();

  const mutate = async (params: {
    id: string;
    data?: Record<string, string | string[]>;
  }) => {
    const { id, data } = params;
    await axios.put(`${url}/${id}`, data);
  };
  return useMutation(mutate);
};

export const useFetchResourceById = <T>(
  key: QueryKey,
  id: string | null,
  url?: string,
  config?: AxiosRequestConfig
) => {
  const axios = useAxios();
  return useQuery(
    key,
    async () => {
      if (!url) throw new Error('URL is required');
      const data: T = await axios.get(`${url}`, config);
      return data;
    },
    {
      enabled: Boolean(id),
    }
  );
};
export const useDeleteUserOnRole = (baseURL: string) => {
  const axios = useAxios();

  const mutate = async ({
    roleId,
    userId,
  }: {
    roleId: string;
    userId: string;
  }) => {
    const url = `${baseURL}/${roleId}/users/${userId}`;
    await axios.delete(url);
  };

  return useMutation(mutate);
};
