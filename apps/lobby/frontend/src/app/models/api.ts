export interface SuccessResult<T> {
  data: T;
}

export interface ErrorResult {
  message: string;
}

export interface ObjectIdParam {
  _id: string;
}
