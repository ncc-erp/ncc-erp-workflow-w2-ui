import { createContext } from 'react';
import Axios, { AxiosInstance } from 'axios';
import { useContext } from 'react';

console.log('baseurl:', import.meta.env.VITE_BASE_URL);
const axios = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.request.use((config) => {
  // Read token for anywhere, in this case directly from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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

    if (response.status === 401) {
      window.location.href = 'account/login';
    }

    return Promise.reject(new Error(response.statusText || 'Error'));
  },
  (error) => {
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
