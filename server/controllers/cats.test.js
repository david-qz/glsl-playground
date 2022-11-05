// Note the mismatch of import name and library name. This follows the
// documentation example.
import request from 'supertest'
// This JavaScript file imports a TypeScript file from the test suite.
import app from '../app'
import {
  describe,
  expect,
  it,
} from '@jest/globals'
import setupDb from '../setup-data.js'

describe('the server', () => {
  beforeEach(() => {
    setupDb()
  })

  it('successfully gets /cats', () => {
    return request(app)
      .get('/cats')
      .then(res => expect(res.status).toBe(200))
  })

  it('serves a list of cats on GET /cats', () => {
    return request(app)
      .get('/cats')
      .then((res) => {
        expect(res.body[0]).toEqual({id: '1', name: 'Atonic'})
      })
  })
})
