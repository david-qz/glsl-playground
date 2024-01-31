import { expect, describe, it, beforeEach } from "bun:test";
import request from "supertest";
import app from "../app";
import { CookieAccessInfo } from "cookiejar";
import environment from "../environment";
import { testUserCredentials, setupDbForTest } from "./utils";

describe("API /users routes", () => {
  beforeEach(async () => {
    await setupDbForTest();
  });

  it("POST /users should create a new user and log them in", async () => {
    const newUser = testUserCredentials.new;

    // POST to route to create new user
    const agent = request.agent(app);
    const response = await agent.post("/api/v1/users").send(newUser);
    expect(response.status).toEqual(200);

    // Should return user
    const user = response.body;
    expect(user).toMatchObject({
      id: expect.any(String),
      email: newUser.email,
    });

    // Should create a session cookie
    const session = agent.jar.getCookie(environment.SESSION_COOKIE, CookieAccessInfo.All);
    expect(session).toBeDefined();
  });

  it("POST /users should error if email already exists", async () => {
    // Some credentials with the same email as an existing user
    const userCredentials = { ...testUserCredentials.existing, password: "blahblahblah" };

    // Expect sign-up request to fail
    const response = await request(app).post("/api/v1/users").send(userCredentials);
    expect(response.status).toEqual(409);
  });

  it("GET /users/me should return the current user", async () => {
    const userCredentials = testUserCredentials.existing;

    // First Log in
    const agent = request.agent(app);
    await agent.post("/api/v1/users/sessions").send(userCredentials);

    // Now get the current user
    const response = await agent.get("/api/v1/users/me");
    expect(response.status).toEqual(200);

    const user = response.body;
    expect(user).toMatchObject({
      id: expect.any(String),
      email: userCredentials.email,
    });
  });

  it("GET /users/me should return 401 status if not logged in", async () => {
    // Get the current user without logging in
    const response = await request(app).get("/api/v1/users/me");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(null);
  });

  it("POST /users/sessions should log a user in", async () => {
    const userCredentials = testUserCredentials.existing;

    // Request should be successful
    const agent = request.agent(app);
    const response = await agent.post("/api/v1/users/sessions").send(userCredentials);
    expect(response.status).toEqual(200);

    // Should create a session cookie
    const session = agent.jar.getCookie(environment.SESSION_COOKIE, CookieAccessInfo.All);
    expect(session).toBeDefined();
  });

  it("DELETE /users/sessions should log a user out", async () => {
    const userCredentials = testUserCredentials.existing;

    // First log in
    const agent = request.agent(app);
    await agent.post("/api/v1/users/sessions").send(userCredentials);

    // Make sure we have a session
    let session = agent.jar.getCookie(environment.SESSION_COOKIE, CookieAccessInfo.All);
    expect(session).toBeDefined();

    // Now log out
    const response = await agent.delete("/api/v1/users/sessions");
    expect(response.status).toEqual(200);

    // Session cookie should be cleared
    session = agent.jar.getCookie(environment.SESSION_COOKIE, CookieAccessInfo.All);
    expect(session).toBeUndefined();
  });
});
