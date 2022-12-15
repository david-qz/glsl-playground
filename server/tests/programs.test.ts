/* @jest-environment node */
import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { seedDatabase, setupDatabase } from "../database.js";
import { type UserCredentials, testUsers } from "./utils";

describe("API /programs routes", () => {
  beforeEach(async () => {
    await setupDatabase();
    await seedDatabase();
  });

  it("GET /programs/:id should return a program", async () => {
    const response = await request(app).get("/programs/1");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      title: expect.any(String),
      vertexSource: expect.any(String),
      fragmentSource: expect.any(String),
      didCompile: expect.any(Boolean),
      createdAt: expect.any(String),
      modifiedAt: expect.any(String),
    });
  });

  it("GET /programs/:id should return 404 for invalid id", async () => {
    const response = await request(app).get("/programs/999999");
    expect(response.status).toEqual(404);
  });

  it("GET /programs should return all the user's programs", async () => {
    const credentials: UserCredentials = testUsers.existing;

    // Log in
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    // Get programs
    const response = await agent.get("/programs");
    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      title: expect.any(String),
      vertexSource: expect.any(String),
      fragmentSource: expect.any(String),
      didCompile: expect.any(Boolean),
      createdAt: expect.any(String),
      modifiedAt: expect.any(String),
    });
  });

  it("POST /programs should create and return a new program", async () => {
    const credentials: UserCredentials = testUsers.existing;

    // Log in
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    const newProgramData = {
      title: "a new program",
      vertexSource: "bahfjasdhlkjg",
      fragmentSource: "ajhsdfliuhefa",
      didCompile: false,
    };

    const response = await agent.post("/programs").send(newProgramData);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      title: newProgramData.title,
      vertexSource: newProgramData.vertexSource,
      fragmentSource: newProgramData.fragmentSource,
      didCompile: false,
      createdAt: expect.any(String),
      modifiedAt: expect.any(String),
    });
  });

  it("POST /programs requires authentication", async () => {
    const newProgramData = {
      title: "a new program",
      vertexSource: "bahfjasdhlkjg",
      fragmentSource: "ajhsdfliuhefa",
      didCompile: false,
    };

    const response = await request(app).post("/programs").send(newProgramData);
    expect(response.status).toEqual(401);
  });

  it("PATCH /programs/:id should update a program", async () => {
    const credentials: UserCredentials = testUsers.existing;

    // Log in
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    // Get some updated data
    const updateData = {
      vertexSource: "new vertex code",
      fragmentSource: "new fragment code",
    };

    // Do the update
    const response = await agent.patch("/programs/1").send(updateData);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      title: expect.any(String),
      vertexSource: updateData.vertexSource,
      fragmentSource: updateData.fragmentSource,
      didCompile: expect.any(Boolean),
      createdAt: expect.any(String),
      modifiedAt: expect.any(String),
    });
  });

  it("PATCH /programs/:id shouldn't allow updating programs not owned by the current user", async () => {
    const credentials: UserCredentials = testUsers.troublesome;

    // Log in as the troublesome user
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    // Try to modify another user's program
    const response = await agent.patch("/programs/1").send({ title: "user 1 smells" });
    expect(response.status).toEqual(403);
  });

  it("DELETE /programs/:id should delete a program", async () => {
    const credentials: UserCredentials = testUsers.existing;

    // Log in
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    // Delete the program
    const deleteResponse = await agent.delete("/programs/1");
    expect(deleteResponse.status).toEqual(200);

    const getResponse = await agent.get("/programs/1");
    expect(getResponse.status).toEqual(404);
  });

  it("DELETE /programs/:id shouldn't allow users to delete programs they don't own", async () => {
    const credentials: UserCredentials = testUsers.troublesome;

    // Log in as the troublesome user
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    // Try to delete the program
    const deleteResponse = await agent.delete("/programs/1");
    expect(deleteResponse.status).toEqual(403);
  });
});
