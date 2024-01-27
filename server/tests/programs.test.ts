/* @jest-environment node */
import { describe, it } from "mocha";
import { expect } from "chai";
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
    expect(response.status).equals(200);
    expectProgram(response.body);
  });

  it("GET /programs/:id should return 404 for invalid id", async () => {
    const response = await request(app).get("/programs/999999");
    expect(response.status).equals(404);
  });

  it("GET /programs should return all the user's programs", async () => {
    const credentials: UserCredentials = testUsers.existing;

    // Log in
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    // Get programs
    const response = await agent.get("/programs");
    expect(response.status).equals(200);
    expect(response.body).is.an("array");
    expectProgram(response.body[0]);
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
    expect(response.status).equals(200);

    const program = response.body;
    expectProgram(program);
    expect(program.title).equals(newProgramData.title);
    expect(program.vertexSource).equals(newProgramData.vertexSource);
    expect(program.fragmentSource).equals(newProgramData.fragmentSource);
    expect(program.didCompile).equals(newProgramData.didCompile);
  });

  it("POST /programs requires authentication", async () => {
    const newProgramData = {
      title: "a new program",
      vertexSource: "bahfjasdhlkjg",
      fragmentSource: "ajhsdfliuhefa",
      didCompile: false,
    };

    const response = await request(app).post("/programs").send(newProgramData);
    expect(response.status).equals(401);
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
    expect(response.status).equals(200);

    const program = response.body;
    expectProgram(program);
    expect(program.vertexSource).equals(updateData.vertexSource);
    expect(program.fragmentSource).equals(updateData.fragmentSource);
  });

  it("PATCH /programs/:id shouldn't allow updating programs not owned by the current user", async () => {
    const credentials: UserCredentials = testUsers.troublesome;

    // Log in as the troublesome user
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    // Try to modify another user's program
    const response = await agent.patch("/programs/1").send({ title: "user 1 smells" });
    expect(response.status).equals(403);
  });

  it("DELETE /programs/:id should delete a program", async () => {
    const credentials: UserCredentials = testUsers.existing;

    // Log in
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    // Delete the program
    const deleteResponse = await agent.delete("/programs/1");
    expect(deleteResponse.status).equals(200);

    const getResponse = await agent.get("/programs/1");
    expect(getResponse.status).equals(404);
  });

  it("DELETE /programs/:id shouldn't allow users to delete programs they don't own", async () => {
    const credentials: UserCredentials = testUsers.troublesome;

    // Log in as the troublesome user
    const agent = request.agent(app);
    await agent.post("/users/sessions").send(credentials);

    // Try to delete the program
    const deleteResponse = await agent.delete("/programs/1");
    expect(deleteResponse.status).equals(403);
  });
});

// biome-ignore lint/suspicious/noExplicitAny:
function expectProgram(program: any) {
  expect(program).to.have.keys(
    "id",
    "userId",
    "title",
    "vertexSource",
    "fragmentSource",
    "didCompile",
    "createdAt",
    "modifiedAt",
  );
  expect(program.id).is.a("string");
  expect(program.userId).is.a("string");
  expect(program.title).is.a("string");
  expect(program.vertexSource).is.a("string");
  expect(program.fragmentSource).is.a("string");
  expect(program.didCompile).is.a("boolean");
  expect(program.createdAt).is.a("string");
  expect(program.modifiedAt).is.a("string");
}
