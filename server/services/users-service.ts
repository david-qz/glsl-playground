import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user-model';
import HttpError from '../utils/http-error';

// Try to protect against running the app without an intentionally set JWT secret.
if (!process.env.JWT_SECRET) {
  console.log('Please set a JWT_SECRET environment variable and try again.');
  process.exit(1);
}

const secret: string = process.env.JWT_SECRET;

export async function create(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

  try {
    return await User.insert(email, passwordHash);
  } catch (error) {
    if (error instanceof Error && error.message.match(/violates unique constraint "users_email_key"/)) {
      throw new HttpError('username already in use', 409);
    }
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  const user = await User.getByEmail(email);
  if (!user) throw new HttpError('invalid email/password', 401);

  if (!bcrypt.compareSync(password, user.passwordHash)) {
    throw new HttpError('invalid email/password', 401);
  }

  return jwt.sign({ ...user }, secret, { expiresIn: '1 day' });
}
