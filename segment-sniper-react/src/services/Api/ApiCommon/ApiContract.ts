export interface ApiContract<TRequest = any>
  extends BaseApiRequestContract<TRequest> {
  baseUrl: string;
}

export interface BaseApiRequestContract<TRequest> extends BaseApiContract {
  request: TRequest;
}

export interface BaseApiContract {
  token?: string;
  abortController?: AbortController;
}
