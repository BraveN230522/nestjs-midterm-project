export interface ObjectAny {
  [key: string]: any;
}

export interface IResponse<T> {
  data: T;
}

export interface IPageOption {
  page?: number;
  perPage?: number;
}
