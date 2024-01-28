import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Programs {
  createdAt: Generated<Timestamp>;
  didCompile: Generated<boolean>;
  fragmentSource: Generated<string>;
  id: string;
  modifiedAt: Generated<Timestamp>;
  title: Generated<string>;
  userId: string;
  vertexSource: Generated<string>;
}

export interface Users {
  email: string;
  id: string;
  passwordHash: string;
}

export interface DB {
  programs: Programs;
  users: Users;
}
