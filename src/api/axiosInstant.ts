import { createContext } from 'react';
import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  isAxiosError,
} from 'axios';
import { useContext } from 'react';
import { toast } from 'common/components/StandaloneToast';
import { getItem } from 'utils/localStorage';
import { LocalStorageKeys } from 'common/enums';

const { VITE_API_BASE_URL } = import.meta.env;

const axios = Axios.create({
  baseURL: VITE_API_BASE_URL,
  timeout: 10000,
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
    if (isAxiosError(error)) {
      const { status, data } = (error.response as AxiosResponse) ?? {};
      const { code } = error;

      if (code === 'ERR_NETWORK') {
        toast({
          title: 'Network Error!',
          status: 'error',
        });
      } else {
        const errorMessage = data?.error?.message || 'An error occurred';

      switch (status) {
        case 401: {
          window.location.href = '/login';
          break;
        }
        case 403: 
        case 404: 
        case 500: {
          toast({
            title: errorMessage,
            status: 'error',
          });
          break;
        }
        default: {
          toast({
            title: errorMessage,
            status: 'error',
          });
          break;
        }
      }
    }}

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
