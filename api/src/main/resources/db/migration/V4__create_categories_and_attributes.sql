create table catalog_categories (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    name varchar(160) not null,
    slug varchar(180) not null unique,
    description text,
    parent_id bigint references catalog_categories(id) on delete restrict,
    active boolean not null default true,
    sort_order integer not null default 0,
    seo_title varchar(180),
    seo_description varchar(300)
);

create index idx_catalog_categories_parent_id on catalog_categories(parent_id);
create index idx_catalog_categories_active on catalog_categories(active);

create table product_attributes (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    name varchar(120) not null,
    slug varchar(140) not null unique,
    type varchar(30) not null,
    filterable boolean not null default true,
    active boolean not null default true,
    sort_order integer not null default 0
);

create index idx_product_attributes_active on product_attributes(active);

create table product_attribute_values (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    attribute_id bigint not null references product_attributes(id) on delete cascade,
    value varchar(160) not null,
    slug varchar(180) not null,
    sort_order integer not null default 0,
    active boolean not null default true,
    unique (attribute_id, slug)
);

create index idx_product_attribute_values_attribute_id on product_attribute_values(attribute_id);
create index idx_product_attribute_values_active on product_attribute_values(active);
