import { ProgramData } from '../../common/api-types';
import apiPrefix from './api-prefix';

export async function getById(id: string): Promise<ProgramData | undefined> {
  const response = await fetch(apiPrefix + '/programs/' + id);

  if (!response.ok) {
    return;
  }

  return await response.json() as ProgramData;
}

export async function getUsersPrograms(): Promise<Array<ProgramData> | undefined> {
  const response = await fetch(apiPrefix + '/programs');

  if (!response.ok) {
    return;
  }

  return await response.json() as Array<ProgramData>;
}

export async function create(program: ProgramData): Promise<ProgramData | undefined> {
  const response = await fetch(apiPrefix + '/programs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(program)
  });

  if (!response.ok) {
    return;
  }

  return await response.json() as ProgramData;
}

export async function update(program: ProgramData): Promise<ProgramData | undefined> {
  const response = await fetch(apiPrefix + '/programs/' + program.id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(program)
  });

  console.log('patching');

  if (!response.ok) {
    return;
  }

  return await response.json() as ProgramData;
}
