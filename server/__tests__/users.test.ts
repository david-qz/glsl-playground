/* @jest-environment node */
// The above comment necessary because express uses `setImmediate` which only exists in a node environment.
// FIXME: It would be much nicer if we could somehow direct jest to use the 'node' environment for all backend testing
//        while keeping the 'jsdom' environment for front end testing.

import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { setupDatabase, seedDatabase } from '../database.js';
import { CookieAccessInfo } from 'cookiejar';

describe('users controller', () => {
  beforeEach(async () => {
    await setupDatabase();
    await seedDatabase();
  });

  it('#POST /api/v1/users should create a new user and log them in', async () => {
    const newUser = { email: 'test@example.com', password: '123456' };

    // POST to route to create new user
    const agent = request.agent(app);
    const response = await agent.post('/users').send(newUser);
    expect(response.status).toEqual(200);

    // Should return user
    const user = response.body;
    expect(user).toEqual({
      id: expect.any(String),
      email: newUser.email
    });

    // Should create a session cookie
    const session = agent.jar.getCookie('session', CookieAccessInfo.All);
    expect(session).not.toBeUndefined();
  });
});
