-- Use this file to define your SQL tables.
-- The SQL in this file will be executed when you run `npm run setup-db`.
drop table if exists programs;
drop table if exists users;

create table users (
  id bigint generated always as identity primary key,
  email text not null unique,
  password_hash text not null
);

create table programs (
  id bigint generated always as identity primary key,
  user_id bigint references users(id) on delete cascade not null,
  title text not null,
  vertex_shader_source text not null,
  fragment_shader_source text not null,
  did_compile boolean not null,
  created_at timestamp default now(),
  modified_at timestamp default now()
);

create or replace function handle_timestamps_on_update()
returns trigger as
$$
begin
  new.created_at = old.created_at;
  new.modified_at = now();
  return new;
end;
$$ language 'plpgsql';

create or replace function handle_timestamps_on_insert()
returns trigger as
$$
begin
  new.created_at = now();
  new.modified_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger programs_update_timestamps
before update on programs
for each row execute procedure handle_timestamps_on_update();

create trigger programs_insert_timestamps
before insert on programs
for each row execute procedure handle_timestamps_on_insert();
