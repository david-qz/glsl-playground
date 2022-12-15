import pool from "../database.js";
import { type UserToken } from "../../common/api-types";

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
};

export default class User {
  id: string;
  email: string;
  #passwordHash: string;

  constructor(row: UserRow) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert(email: string, passwordHash: string): Promise<User> {
    const { rows } = await pool.query<UserRow>("insert into users (email, password_hash) values ($1, $2) returning *", [
      email,
      passwordHash,
    ]);

    if (!rows[0]) throw new Error("Unable to create user for unknown reason");

    return new User(rows[0]);
  }

  static async getByEmail(email: string): Promise<User | undefined> {
    const { rows } = await pool.query<UserRow>("select * from users where email = $1", [email]);

    if (!rows[0]) return undefined;

    return new User(rows[0]);
  }

  get passwordHash(): string {
    return this.#passwordHash;
  }

  toToken(): UserToken {
    return { id: this.id, email: this.email };
  }
}
