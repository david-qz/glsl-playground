/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { setupDatabase, seedDatabase } from '../database.js';

describe('API /programs routes', () => {
  beforeEach(async () => {
    await setupDatabase();
    await seedDatabase();
  });

  it('GET /programs/:id should return a program', async () => {
    const response = await request(app).get('/programs/1');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      title: expect.any(String),
      vertexShaderSource: expect.any(String),
      fragmentShaderSource: expect.any(String),
      didCompile: expect.any(Boolean),
      createdAt: expect.any(String),
      modifiedAt: expect.any(String),
    });
  });

  it('GET /programs/:id should return 404 for invalid id', async () => {
    const response = await request(app).get('/programs/999999');
    expect(response.status).toEqual(404);
  });

  it('PATCH /programs/:id should update a program', async () => {
    const updateData = {
      vertexShaderSource: 'new vertex code',
      fragmentShaderSource: 'new fragment code'
    };

    const response = await request(app).patch('/programs/1').send(updateData);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      title: expect.any(String),
      vertexShaderSource: updateData.vertexShaderSource,
      fragmentShaderSource: updateData.fragmentShaderSource,
      didCompile: expect.any(Boolean),
      createdAt: expect.any(String),
      modifiedAt: expect.any(String),
    });
  });
});
