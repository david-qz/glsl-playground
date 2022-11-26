-- Use this file to define your SQL tables.
-- The SQL in this file will be executed when you run `npm run setup-db`.
drop table if exists users;

create table users (
  id bigint generated always as identity primary key,
  email text not null unique,
  password_hash text not null
);
