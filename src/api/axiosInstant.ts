import { createContext, useContext } from 'react';
import Axios, {
  AxiosInstance,
  AxiosResponse,
  isAxiosError,
} from 'axios';
import { toast } from 'common/components/StandaloneToast';
import { getItem, setItem, removeItem } from 'utils';
import { LocalStorageKeys } from 'common/enums';

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
    // Handle redirection (3xx responses)
    if (response && response.status >= 300 && response.status < 400) {
      const redirectUrl = response.headers['location']; // Extract redirect URL
      if (redirectUrl) {
        const urlParams = new URLSearchParams(new URL(redirectUrl).search);
        const httpStatusCode = urlParams.get('httpStatusCode');

        if (httpStatusCode === '410') {
          console.log('Redirect URL contains httpStatusCode=410. Redirecting to login...');
          window.location.href = '/login'; // Redirect to login page
        }
      }
    }

    const data = response.data;
    if (response.status === 200) {
      return data;
    }

    return response;
  },
  (error) => {
    if (isAxiosError(error)) {
      const { data, status } = (error.response as AxiosResponse) ?? {};
      const { message } = error;
      const errorMessage = data?.error?.message || message;

      switch (status) {
        case 401:
          removeItem(LocalStorageKeys.accessToken);
          setItem(LocalStorageKeys.prevURL, window.location.href);
          window.location.replace('/login');
          return;
        default:
          toast({
            title: errorMessage,
            status: 'error',
          });
      }
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
