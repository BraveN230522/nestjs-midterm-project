export interface ObjectAny {
  [key: string]: any;
}

export interface IResponse<T> {
  data: T;
}

export interface IPagination {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

export interface IPageOption {
  page?: number;
  perPage?: number;
}

export interface IPaginationResponse<T> {
  items: T[] | Record<string, any>;
  pagination: IPagination;
}
