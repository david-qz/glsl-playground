import environment from '../environment.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';
import HttpError from '../utils/http-error.js';
import * as EmailValidator from 'email-validator';

export async function create(email: string, password: string): Promise<User> {
  const passwordHash = await bcrypt.hash(password, environment.SALT_ROUNDS);

  if (!EmailValidator.validate(email)) {
    throw new HttpError('Not a valid email', 400);
  }

  if (password.length < 6) {
    throw new HttpError('Password too short', 400);
  }

  try {
    return await User.insert(email, passwordHash);
  } catch (error) {
    if (error instanceof Error && error.message.match(/violates unique constraint "users_email_key"/)) {
      throw new HttpError('username already in use', 409);
    }
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<[User, string]> {
  const user = await User.getByEmail(email);
  if (!user) throw new HttpError('invalid email/password', 401);

  if (!bcrypt.compareSync(password, user.passwordHash)) {
    throw new HttpError('invalid email/password', 401);
  }

  const token = jwt.sign({ ...user }, environment.JWT_SECRET, { expiresIn: '1 day' });

  return [user, token];
}
