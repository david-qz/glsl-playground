insert into users
(
  email,
  password_hash
)
values
(
  'existing.user@test.com',
  '$2b$10$VFgHUgnL0ODK9oWYSHVK1e0p0lLeZmxXdTdGt/EFQGL/SWBJd6D2O'
),
(
  'troublesome.user@test.com',
  '$2b$10$VFgHUgnL0ODK9oWYSHVK1e0p0lLeZmxXdTdGt/EFQGL/SWBJd6D2O'
);

insert into programs
(
  user_id,
  title,
  vertex_source,
  fragment_source,
  did_compile
)
values
(
  1,
  'a cool program',
  'vertex code',
  'fragment code',
  false
);
