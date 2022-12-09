/* @jest-environment node */
// The above comment necessary because express uses `setImmediate` which only exists in a node environment.
// FIXME: It would be much nicer if we could somehow direct jest to use the 'node' environment for all backend testing
//        while keeping the 'jsdom' environment for front end testing.

import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { setupDatabase, seedDatabase } from '../database.js';
import { CookieAccessInfo } from 'cookiejar';
import environment from '../environment';
import { testUsers, type UserCredentials } from './utils';

describe('API /users routes', () => {
  beforeEach(async () => {
    await setupDatabase();
    await seedDatabase();
  });

  it('POST /users should create a new user and log them in', async () => {
    const newUser = testUsers.new;

    // POST to route to create new user
    const agent = request.agent(app);
    const response = await agent.post('/users').send(newUser);
    expect(response.status).toEqual(200);

    // Should return user
    const user = response.body;
    expect(user).toEqual({
      id: expect.any(String),
      email: newUser.email,
    });

    // Should create a session cookie
    const session = agent.jar.getCookie(environment.SESSION_COOKIE, CookieAccessInfo.All);
    expect(session).not.toBeUndefined();
  });

  it('POST /users should error if email already exists', async () => {
    // Some credentials with the same email as an existing user
    const userCredentials: UserCredentials = { ...testUsers.existing, password: 'blahblahblah' };

    // Expect sign-up request to fail
    const response = await request(app).post('/users').send(userCredentials);
    expect(response.status).toEqual(409);
  });

  it('GET /users/me should return the current user', async () => {
    const userCredentials = testUsers.existing;

    // First Log in
    const agent = request.agent(app);
    await agent.post('/users/sessions').send(userCredentials);

    // Now get the current user
    const response = await agent.get('/users/me');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      email: userCredentials.email,
    });
  });

  it('GET /users/me should return 401 status if not logged in', async () => {
    // Get the current user without logging in
    const response = await request(app).get('/users/me');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(null);
  });

  it('POST /users/sessions should log a user in', async () => {
    const userCredentials = testUsers.existing;

    // Request should be successful
    const agent = request.agent(app);
    const response = await agent.post('/users/sessions').send(userCredentials);
    expect(response.status).toEqual(200);

    // Should create a session cookie
    const session = agent.jar.getCookie(environment.SESSION_COOKIE, CookieAccessInfo.All);
    expect(session).not.toBeUndefined();
  });

  it('DELETE /users/sessions should log a user out', async () => {
    const userCredentials = testUsers.existing;

    // First log in
    const agent = request.agent(app);
    await agent.post('/users/sessions').send(userCredentials);

    // Make sure we have a session
    let session = agent.jar.getCookie(environment.SESSION_COOKIE, CookieAccessInfo.All);
    expect(session).not.toBeUndefined();

    // Now log out
    const response = await agent.delete('/users/sessions');
    expect(response.status).toEqual(200);

    // Session cookie should be cleared
    session = agent.jar.getCookie(environment.SESSION_COOKIE, CookieAccessInfo.All);
    expect(session).toBeUndefined();
  });
});
