/*******************************************************************************
 * This file declares any sort of actions to execute after Jest is setup. At
 * this point, triggers like afterAll/afterEach and beforeAll/beforeEach are
 * available. This is a good place to put global setup and tear down.
 ******************************************************************************/
import { afterAll } from '@jest/globals'
import pool from './server/database.js'
// These don't seem to work, but there's documentation stating to do this.
// Perhaps a bug fix will one day make this operable again. Doesn't seem to hurt
// anything. Keep around if matchers get fixed. See:
// https://github.com/testing-library/jest-dom/issues/442
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

afterAll(() => pool.end())
global.fetch = jest.fn()
