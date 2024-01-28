import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../app";
import { testUserCredentials, setupDbForTest, testPrograms } from "./utils";

describe("API /programs routes", () => {
  beforeEach(async () => {
    await setupDbForTest();
  });

  it("GET /programs/:id should return a program", async () => {
    const response = await request(app).get(`/api/v1/programs/${testPrograms.existing.id}`);
    expect(response.status).equals(200);
    expectProgram(response.body);
  });

  it("GET /programs/:id should return 404 for invalid id", async () => {
    const response = await request(app).get("/api/v1/programs/64f05b2a-50f5-43fd-9331-50f0c03e4495");
    expect(response.status).equals(404);
  });

  it("GET /programs should return all the user's programs", async () => {
    // Log in
    const agent = request.agent(app);
    await agent.post("/api/v1/users/sessions").send(testUserCredentials.existing);

    // Get programs
    const response = await agent.get("/api/v1/programs");
    expect(response.status).equals(200);
    expect(response.body).is.an("array");
    expectProgram(response.body[0]);
  });

  it("POST /programs should create and return a new program", async () => {
    // Log in
    const agent = request.agent(app);
    await agent.post("/api/v1/users/sessions").send(testUserCredentials.existing);

    const newProgramData = {
      title: "a new program",
      vertexSource: "bahfjasdhlkjg",
      fragmentSource: "ajhsdfliuhefa",
      didCompile: false,
    };

    const response = await agent.post("/api/v1/programs").send(newProgramData);
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

    const response = await request(app).post("/api/v1/programs").send(newProgramData);
    expect(response.status).equals(401);
  });

  it("PATCH /programs/:id should update a program", async () => {
    // Log in
    const agent = request.agent(app);
    await agent.post("/api/v1/users/sessions").send(testUserCredentials.existing);

    // Get some updated data
    const updateData = {
      vertexSource: "new vertex code",
      fragmentSource: "new fragment code",
    };

    // Do the update
    const response = await agent.patch(`/api/v1/programs/${testPrograms.existing.id}`).send(updateData);
    expect(response.status).equals(200);

    const program = response.body;
    expectProgram(program);
    expect(program.vertexSource).equals(updateData.vertexSource);
    expect(program.fragmentSource).equals(updateData.fragmentSource);
  });

  it("PATCH /programs/:id shouldn't allow updating programs not owned by the current user", async () => {
    // Log in as the troublesome user
    const agent = request.agent(app);
    await agent.post("/api/v1/users/sessions").send(testUserCredentials.troublesome);

    // Try to modify another user's program
    const response = await agent.patch(`/api/v1/programs/${testPrograms.existing.id}`).send({ title: "user 1 smells" });
    expect(response.status).equals(403);
  });

  it("DELETE /programs/:id should delete a program", async () => {
    // Log in
    const agent = request.agent(app);
    await agent.post("/api/v1/users/sessions").send(testUserCredentials.existing);

    // Delete the program
    const deleteResponse = await agent.delete(`/api/v1/programs/${testPrograms.existing.id}`);
    expect(deleteResponse.status).equals(200);

    const getResponse = await agent.get(`/api/v1/programs/${testPrograms.existing.id}`);
    expect(getResponse.status).equals(404);
  });

  it("DELETE /programs/:id shouldn't allow users to delete programs they don't own", async () => {
    // Log in as the troublesome user
    const agent = request.agent(app);
    await agent.post("/api/v1/users/sessions").send(testUserCredentials.troublesome);

    // Try to delete the program
    const deleteResponse = await agent.delete(`/api/v1/programs/${testPrograms.existing.id}`);
    expect(deleteResponse.status).equals(403);
  });
});

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
