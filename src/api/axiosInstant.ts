import { createContext, useContext } from 'react';
import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  isAxiosError,
} from 'axios';
import { toast } from 'common/components/StandaloneToast';
import { getItem } from 'utils';
import { LocalStorageKeys } from 'common/enums';
import * as Sentry from '@sentry/react';

const { VITE_API_BASE_URL } = import.meta.env;

const axios = Axios.create({
  baseURL: VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.request.use((config) => {
  const accessToken: string | null = getItem(LocalStorageKeys.accessToken);
  if (accessToken != null) {
    const accessHeader = `Bearer ${accessToken}`;
    if (config.headers != null) {
      config.headers.Authorization = accessHeader;
    }
  }
  return config;
});

// response interceptor
axios.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (response.status === 200) {
      return data;
    }

    return response;
  },
  (error: AxiosError | Error) => {
    Sentry.captureException(error);
    if (isAxiosError(error)) {
      const { data } = (error.response as AxiosResponse) ?? {};
      const { message } = error;
      const errorMessage = data?.error?.message || message;
      toast({
        title: errorMessage,
        status: 'error',
      });
    }
    return Promise.reject(error);
  }
);

export const AxiosContext = createContext<AxiosInstance>(
  new Proxy(axios, {
    apply: () => {
      throw new Error('You must wrap your component in an AxiosProvider');
    },
    get: () => {
      throw new Error('You must wrap your component in an AxiosProvider');
    },
  })
);

export const useAxios = () => {
  return useContext(AxiosContext);
};

export default axios;
