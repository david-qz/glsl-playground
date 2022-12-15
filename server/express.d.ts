import { type UserToken } from '../common/api-types';

declare global {
  namespace Express {
    export interface Request {
      user?: UserToken
    }
  }
}
