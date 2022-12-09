export type UserCredentials = { email: string, password: string };
type TestUsers = 'existing' | 'troublesome' | 'new';

export const testUsers: Record<TestUsers, UserCredentials> = {
  existing: { email: 'existing.user@test.com', password: '123456' },
  new: { email: 'new.user@test.com', password: 'qwerty' },
  troublesome: { email: 'troublesome.user@test.com', password: '123456' },
};
