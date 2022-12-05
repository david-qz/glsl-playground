import apiPrefix from './api-prefix';
import { type UserToken, type ApiError } from '../../common/api-types';

export async function getUser(): Promise<UserToken | null> {
  const response = await fetch(apiPrefix + '/users/me');

  if (!response.ok) return null;

  const json: unknown = await response.json();
  return json as UserToken;
}

export async function logIn(email: string, password: string): Promise<UserToken | string> {
  const response = await fetch(apiPrefix + '/users/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const json: unknown = await response.json();

  if (!response.ok) return (json as ApiError).message;

  return json as UserToken;
}

export async function logOut(): Promise<boolean> {
  const response = await fetch(apiPrefix + '/users/sessions', {
    method: 'DELETE'
  });
  return response.ok;
}

export async function signUp(email: string, password: string): Promise<UserToken | string> {
  const response = await fetch(apiPrefix + '/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const json: unknown = await response.json();

  if (!response.ok) return (json as ApiError).message;

  return json as UserToken;
}
