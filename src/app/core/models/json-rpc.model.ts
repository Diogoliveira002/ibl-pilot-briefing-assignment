export interface JsonRpcRequest<T = unknown> {
  id: string;
  method: string;
  params: [T];
}

export interface JsonRpcError {
  code: number;
  message: string;
  data: unknown | null;
}

export interface JsonRpcResponse<T = unknown> {
  id: string;
  error: JsonRpcError | null;
  result: T | null;
}
