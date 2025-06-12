import { get, post } from '@/utils/fetch.util';

import type { ISupplier } from '@/core/interfaces/supplier.interface';
import type { TApiListResponse, TApiResponse } from '@/core/types/api-response.type';

import type { ListSupplierDTO } from './dtos/list-supplier.dto';
import type { ImportSuppliersDTO } from './dtos/import-suppliers.dto';

import type { FormDataFields } from '@/core/helpers/form-data-fields';
import type { ISupplierOverview } from '@/core/interfaces/overview.interface';

export const overviewSuppliers = async (): Promise<TApiResponse<ISupplierOverview>> => {
  return await get<TApiResponse<ISupplierOverview>>('suppliers/overview');
};

export const listSuppliers = async (
  input?: ListSupplierDTO,
): Promise<TApiListResponse<ISupplier>> => {
  return await get<TApiListResponse<ISupplier>>('suppliers', { params: input });
};

export const importSuppliers = async (input: FormDataFields<ImportSuppliersDTO>): Promise<void> => {
  return await post<void>('suppliers/import', input);
};
