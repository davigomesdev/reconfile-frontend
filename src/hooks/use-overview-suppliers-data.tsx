import type { TApiResponse } from '@/core/types/api-response.type';
import type { ISupplierOverview } from '@/core/interfaces/overview.interface';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

import { overviewSuppliers } from '@/services/api/supplier/supplier.service';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

interface UseOverviewSuppliersDataProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  query: TApiResponse<ISupplierOverview> | undefined;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TApiResponse<ISupplierOverview>, Error>>;
}

export const REFERCH_INTERVAL = 100000;
export const OVERVIEW_SUPPLIERS_KEY = 'overview_suppliers';

export const useOverviewSuppliersData = (): UseOverviewSuppliersDataProps => {
  const { isLoading, isError, error, data, refetch } = useQuery<TApiResponse<ISupplierOverview>>({
    queryKey: [OVERVIEW_SUPPLIERS_KEY],
    queryFn: overviewSuppliers,
    placeholderData: keepPreviousData,
    refetchInterval: REFERCH_INTERVAL,
  });

  return {
    isLoading,
    isError,
    error,
    query: data,
    refetch,
  };
};
