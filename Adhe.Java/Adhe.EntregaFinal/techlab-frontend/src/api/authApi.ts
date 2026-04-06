import axios from './axios';

type LoginPayload = {
  email: string;
  password: string;
};

type ResultWrapper<T> = {
  success: boolean;
  message: string | null;
  data: T | null;
};

export async function loginApi(payload: LoginPayload): Promise<string> {
  const resp = await axios.post<ResultWrapper<string>>('/api/auth/login', payload);
  if (resp.data?.data) return resp.data.data;
  throw new Error(resp.data?.message ?? 'Login failed');
}

type Usuario = { id?: number; nombre: string; email: string };

export async function registerApi(payload: { nombre: string; email: string; password: string }): Promise<Usuario> {
  const resp = await axios.post<ResultWrapper<Usuario>>('/api/auth/register', payload);
  if (resp.data?.success && resp.data.data) return resp.data.data;
  throw new Error(resp.data?.message ?? 'Registration failed');
}
