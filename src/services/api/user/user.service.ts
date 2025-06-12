import { get, patch, put } from '@/utils/fetch.util';

import type { IUser } from '@/core/interfaces/user.interface';
import type { TApiListResponse, TApiResponse } from '@/core/types/api-response.type';

import type { ListUsersDTO } from './dtos/list-users.dto';
import type { UpdateUserDTO } from './dtos/update-user.dto';
import type { UpdateCurrentUserDTO } from './dtos/update-current-user.dto';
import type { UpdatePasswordUserDTO } from './dtos/update-password-user.dto';

export const currentUser = async (): Promise<TApiResponse<IUser>> => {
  return await get<TApiResponse<IUser>>('users/current');
};

export const listUsers = async (input?: ListUsersDTO): Promise<TApiListResponse<IUser>> => {
  return await get<TApiListResponse<IUser>>('users', { params: input });
};

export const updateUser = async (input: UpdateUserDTO): Promise<TApiResponse<IUser>> => {
  const { id, ...rest } = input;
  return await put<TApiResponse<IUser>>(`users/${id}`, rest);
};

export const updateCurrentUser = async (
  input: UpdateCurrentUserDTO,
): Promise<TApiResponse<IUser>> => {
  return await put<TApiResponse<IUser>>('users/current', input);
};

export const updatePasswordUser = async (input: UpdatePasswordUserDTO): Promise<void> => {
  return await patch<void>('users/password', input);
};
