import apiPrefix from './api-prefix';

export async function logIn(email: string, password: string): Promise<boolean> {
  const response = await fetch(apiPrefix + '/users/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  return response.ok;
}

export async function logOut() {
  const response = await fetch(apiPrefix + '/users/sessions', {
    method: 'DELETE'
  });
  return response.ok;
}

export async function signUp(email: string, password: string) {
  const response = await fetch(apiPrefix + '/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  return response.ok;
}
