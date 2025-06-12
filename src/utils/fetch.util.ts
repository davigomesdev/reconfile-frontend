import { API_BASE_URL } from '@/constants/env';

import { ApiError } from '@/core/helpers/api-error';
import { ApiErrorTypeEnum } from '@/core/enums/api-error-type.enum';
import type { TRequestMethod } from '@/core/types/request-method.type';

import { getTokens } from './cookie.util';
import { refreshTokens, signout } from '@/services/api/auth/auth.service';

interface FetchRequestConfig {
  method: TRequestMethod;
  headers?: Record<string, string>;
  body?: any;
}

const fetchWrapper = async <T>(
  baseURL: string,
  url: string,
  config: FetchRequestConfig,
): Promise<T> => {
  const { method, headers = {}, body } = config;

  const tokens = getTokens();
  const isFormData = body instanceof FormData;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      ...headers,
    },
    body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
  };

  if (!isFormData && body !== undefined) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  let response = await fetch(`${baseURL}${url}`, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json();
    const apiError = new ApiError(errorData.error);

    if (
      apiError.error.code === 401 &&
      apiError.error.type === ApiErrorTypeEnum.UNAUTHORIZED_EXCEPTION
    ) {
      try {
        const newTokens = await refreshTokens(tokens.refreshToken);

        fetchOptions.headers = {
          ...fetchOptions.headers,
          Authorization: `Bearer ${newTokens.data.accessToken}`,
        };

        response = await fetch(`${baseURL}${url}`, fetchOptions);

        if (!response.ok) {
          throw new ApiError(await response.json());
        }
      } catch (error) {
        signout();
        throw error;
      }
    } else {
      throw apiError;
    }
  }

  return response.json().catch(() => undefined);
};

export async function get<T>(
  url: string,
  options?: {
    params?: Record<string, any>;
    headers?: Record<string, string>;
  },
  baseURL: string = API_BASE_URL,
): Promise<T> {
  const { params, headers } = options || {};

  const filteredParams = params
    ? Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined))
    : {};

  const createQueryString = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            searchParams.append(key, String(item));
          }
        });
      } else {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
    });

    return searchParams.toString();
  };

  const queryString = createQueryString(filteredParams);
  const queryUrl = queryString ? `${url}?${queryString}` : url;

  return fetchWrapper<T>(baseURL, queryUrl, { method: 'GET', headers });
}

export async function post<T>(
  url: string,
  body: any,
  headers?: Record<string, string>,
  baseURL: string = API_BASE_URL,
): Promise<T> {
  return fetchWrapper<T>(baseURL, url, { method: 'POST', body, headers });
}

export async function put<T>(
  url: string,
  body: any,
  headers?: Record<string, string>,
  baseURL: string = API_BASE_URL,
): Promise<T> {
  return fetchWrapper<T>(baseURL, url, { method: 'PUT', body, headers });
}

export async function patch<T>(
  url: string,
  body?: any,
  headers?: Record<string, string>,
  baseURL: string = API_BASE_URL,
): Promise<T> {
  return fetchWrapper<T>(baseURL, url, { method: 'PATCH', body, headers });
}

export async function del<T>(
  url: string,
  body?: any,
  headers?: Record<string, string>,
  baseURL: string = API_BASE_URL,
): Promise<T> {
  return fetchWrapper<T>(baseURL, url, { method: 'DELETE', body, headers });
}
