import { post } from '@/utils/fetch.util';

import type { IAuth } from '@/core/interfaces/auth.interface';
import type { TApiResponse } from '@/core/types/api-response.type';

import type { SignInDTO } from './dtos/signin.dto';
import type { SignUpDTO } from './dtos/signup.dto';

import { clearTokens, saveTokens } from '@/utils/cookie.util';

export const signin = async (input: SignInDTO): Promise<TApiResponse<IAuth>> => {
  return await post<TApiResponse<IAuth>>('auth/signin', input).then((response) => {
    saveTokens(response.data);
    return response;
  });
};

export const signup = async (input: SignUpDTO): Promise<TApiResponse<IAuth>> => {
  return await post<TApiResponse<IAuth>>('auth/signup', input).then((response) => {
    saveTokens(response.data);
    return response;
  });
};

export const refreshTokens = async (refreshToken: string): Promise<TApiResponse<IAuth>> => {
  return await post<TApiResponse<IAuth>>('auth/refresh', { refreshToken }).then((response) => {
    saveTokens(response.data);
    return response;
  });
};

export const signout = (): void => {
  clearTokens();
};
