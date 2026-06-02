import "axios";

declare module "axios" {
  export interface AxiosRequestContext {
    skipAuth?: boolean;
  }

  export interface AxiosRequestConfig {
    context?: AxiosRequestContext;
  }

  export interface InternalAxiosRequestConfig {
    context?: AxiosRequestContext;
  }
}
