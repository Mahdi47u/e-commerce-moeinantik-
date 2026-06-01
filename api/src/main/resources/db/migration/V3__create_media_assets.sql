create table media_assets (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    file_name varchar(255) not null,
    original_file_name varchar(255) not null,
    content_type varchar(120) not null,
    size_bytes bigint not null,
    object_key varchar(600) not null unique,
    url varchar(1000) not null,
    alt_text varchar(255),
    width integer,
    height integer
);

create index idx_media_assets_created_at on media_assets(created_at);
