import type { TSortDirection } from '@/core/types/sort-direction.type';

export interface ListSupplierDTO {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: TSortDirection;
  filter?: string;
  isActive?: boolean;
}
