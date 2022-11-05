-- Use this file to define your SQL tables.
-- The SQL in this file will be executed when you run `npm run setup-db`.

drop table if exists foos;
drop table if exists cats;

create table foos (
  id bigint generated always as identity primary key,
  foo varchar
);

create table cats (
  id bigint generated always as identity primary key,
  name varchar
);

insert into
  foos (foo)
values
  (
    'bar'
  ),
  (
    'baz'
  ),
  (
    'qux'
  )
  ;

insert into
  cats (name)
values
  (
    'Atonic'
  ),
  (
    'Astrophe'
  ),
  (
    'Cher'
  )
  ;
