import apiPrefix from './api-prefix';
import { type UserToken } from '../../common/users';

export async function getUser(): Promise<UserToken | null> {
  const response = await fetch(apiPrefix + '/users');
  if (!response.ok) return null;
  return await response.json();
}

export async function logIn(email: string, password: string): Promise<UserToken | string> {
  const response = await fetch(apiPrefix + '/users/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) return 'error';
  return await response.json();
}

export async function logOut() {
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
  if (!response.ok) return 'error';
  return await response.json();
}
