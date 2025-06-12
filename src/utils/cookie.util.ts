import Cookies from 'js-cookie';

import type { IAuth } from '@/core/interfaces/auth.interface';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const REDIRECT_PATH_KEY = 'redirectPath';

export const getTokens = (): { accessToken: string; refreshToken: string } => {
  const accessToken = Cookies.get(ACCESS_TOKEN_KEY)!;
  const refreshToken = Cookies.get(REFRESH_TOKEN_KEY)!;

  return {
    accessToken,
    refreshToken,
  };
};

export const getRedirectPath = (): string | null => {
  return Cookies.get(REDIRECT_PATH_KEY) ?? null;
};

export const saveTokens = (tokens: IAuth): void => {
  Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, {
    expires: tokens.accessExpiresIn / (60 * 60 * 24),
    path: '/',
  });

  Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
    expires: tokens.refreshExpiresIn / (60 * 60 * 24),
    path: '/',
  });
};

export const savePath = (path: string): void => {
  Cookies.set(REDIRECT_PATH_KEY, path, {
    expires: 30000 / (60 * 60 * 24),
    path: '/',
  });
};

export const clearTokens = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};

export const clearRedirectPath = (): void => {
  Cookies.remove(REDIRECT_PATH_KEY);
};
