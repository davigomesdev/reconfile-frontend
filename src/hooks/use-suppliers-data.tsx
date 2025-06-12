import type { ISupplier } from '@/core/interfaces/supplier.interface';
import type { ListSupplierDTO } from '@/services/api/supplier/dtos/list-supplier.dto';
import type { TApiListResponse } from '@/core/types/api-response.type';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

import { listSuppliers } from '@/services/api/supplier/supplier.service';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

interface UseSuppliersDataProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  query: TApiListResponse<ISupplier> | undefined;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TApiListResponse<ISupplier>, Error>>;
}

export const REFERCH_INTERVAL = 100000;
export const SUPPLIERS_KEY = 'suppliers';

export const useSuppliersData = (input?: ListSupplierDTO): UseSuppliersDataProps => {
  const { isLoading, isError, error, data, refetch } = useQuery<TApiListResponse<ISupplier>>({
    queryKey: [SUPPLIERS_KEY, input],
    queryFn: async () => listSuppliers(input),
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
