import type { TSortDirection } from '@/core/types/sort-direction.type';

export interface ListUsersDTO {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: TSortDirection;
  filter?: string;
  isActive?: boolean;
}
