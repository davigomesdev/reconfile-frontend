type TEntity = any;
type TEntityCollection = TEntity | TEntity[];

export type TMeta = {
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
};

export type TApiResponse<Entity = TEntityCollection> = {
  data: Entity;
};

export type TApiListResponse<Entity> = {
  data: Entity[];
  meta: TMeta;
};
