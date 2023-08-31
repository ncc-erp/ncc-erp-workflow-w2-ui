import { useAxios } from 'api/axiosInstant';
import { AxiosRequestConfig } from 'axios';
import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';

export const useCreate = <T, U>(url: string, config?: AxiosRequestConfig) => {
  const axios = useAxios();

  const mutate = async (params: T) => {
    const data: U = await axios.post(`${url}`, params, config);
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

export const useGetList = <T, D = object>(
  key: QueryKey,
  url: string,
  params?: D,
  config?: AxiosRequestConfig
) => {
  const axios = useAxios();

  const getData = async () => {
    const data: T = await axios.get(`${url}`, {params, ...config});
    return data;
  };

  return useQuery(key, getData);
};

export const useGetListByPost = <T, D = object>(
  key: QueryKey,
  url: string,
  filter?: D,
  config?: AxiosRequestConfig
) => {
  const axios = useAxios();

  const getData = async () => {
    const data: T = await axios.post(`${url}`, filter, config);
    return data;
  };

  return useQuery(key, () => getData());
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
