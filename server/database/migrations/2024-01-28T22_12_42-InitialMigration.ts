import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  const query = sql`
    CREATE TABLE users (
      id uuid PRIMARY KEY,
      email text NOT NULL UNIQUE,
      "passwordHash" text NOT NULL
    );

    CREATE TABLE programs (
      id uuid PRIMARY KEY,
      "userId" uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      title text NOT NULL DEFAULT '',
      "vertexSource" text NOT NULL DEFAULT '',
      "fragmentSource" text NOT NULL DEFAULT '',
      "didCompile" boolean NOT NULL DEFAULT false,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "modifiedAt" timestamp NOT NULL DEFAULT now()
    );
  `;

  await query.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  const query = sql`
    DROP TABLE programs;
    DROP TABLE users;
  `;

  await query.execute(db);
}
