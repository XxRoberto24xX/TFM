import apiClient from "./client";
import { AuthResponse } from "../types/types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    { email, password },
    { context: { skipAuth: true } },
  );
  return response.data;
}

export async function register(email: string, password: string): Promise<void> {
  const response = await apiClient.post<void>("/auth/register", { email, password });
  return response.data;
}

export async function passwordResetEmail(email: string) {
  const response = await apiClient.post<void>("/auth/passwordResetEmail", { email });
  return response.data;
}
