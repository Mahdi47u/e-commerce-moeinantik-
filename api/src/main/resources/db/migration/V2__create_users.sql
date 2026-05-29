create table users (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    username varchar(80) not null unique,
    email varchar(180) not null unique,
    password varchar(255) not null,
    first_name varchar(100),
    last_name varchar(100),
    phone varchar(30),
    enabled boolean not null default true
);

create table user_roles (
    user_id bigint not null references users(id) on delete cascade,
    role varchar(30) not null,
    primary key (user_id, role)
);
