import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

import { AxiosInstance } from 'axios';

export const useAxios = (refreshAccessToken: (refreshToken: string) => Promise<string>, signOut: () => void): AxiosInstance => {
 
  const axiosInstance = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_HOST}/api/v1/`,
  });

  axiosInstance.interceptors.request.use(
    async (config: CustomAxiosRequestConfig) => {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      } catch (error) {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      
      const originalRequest = error.config as CustomAxiosRequestConfig;
  
      if (!error.response) {
        console.log('No response received');
        return Promise.reject(error);
      }
  
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
  
        try {
          const refreshToken = await SecureStore.getItemAsync('refreshToken');
  
          if (refreshToken) {
  
            try {
              const newAccessToken = await refreshAccessToken(refreshToken);
              await SecureStore.setItemAsync('accessToken', newAccessToken);
  
              axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
  
              // Retry the original request with the new access token
              return axiosInstance(originalRequest);
            } catch (refreshError) {
              console.error('Failed to refresh access token', refreshError);
              signOut();
            }
          }
        } catch (secureStoreError) {
          console.error('SecureStore error:', secureStoreError);
        }
      }
  
      return Promise.reject(error);
    }
  );

  

  return axiosInstance
}

