export interface AuthResponse {
  token: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}
