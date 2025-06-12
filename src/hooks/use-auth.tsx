import React from 'react';

import type { IUser } from '@/core/interfaces/user.interface';
import type { TApiResponse } from '@/core/types/api-response.type';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';
import { currentUser } from '@/services/api/user/user.service';

interface UseAuthProps {
  auth: IUser | null;
  isError: boolean;
  isLoading: boolean;
  reaload: (options?: RefetchOptions) => Promise<QueryObserverResult<TApiResponse<IUser>, Error>>;
}

export const REFETCH_INTERVAL = 100000;
export const CURRENT_USER_KEY = 'current_user';

export const useAuth = (): UseAuthProps => {
  const [auth, setAuth] = React.useState<IUser | null>(null);

  const {
    isError,
    isLoading,
    data: user,
    refetch: reaload,
  } = useQuery<TApiResponse<IUser>>({
    queryKey: [CURRENT_USER_KEY],
    queryFn: currentUser,
    retry: false,
    refetchInterval: REFETCH_INTERVAL,
  });

  React.useEffect(() => {
    setAuth(user ? user.data : null);
  }, [user]);

  return {
    auth,
    isError,
    isLoading,
    reaload,
  };
};
