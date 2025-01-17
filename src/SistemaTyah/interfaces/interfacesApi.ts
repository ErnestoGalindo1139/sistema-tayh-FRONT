// Interfaces API
export interface ApiResponse<T> {
  message: string;
  success: boolean;
  body: T;
}

export interface IApiError {
  message: string;
}
