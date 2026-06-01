create table products (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    name varchar(220) not null,
    slug varchar(240) not null unique,
    sku varchar(80) unique,
    short_description varchar(500),
    description text,
    category_id bigint references catalog_categories(id) on delete restrict,
    status varchar(30) not null,
    featured boolean not null default false,
    sort_order integer not null default 0,
    seo_title varchar(180),
    seo_description varchar(300)
);

create index idx_products_category_id on products(category_id);
create index idx_products_status on products(status);
create index idx_products_featured on products(featured);

create table product_variants (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    product_id bigint not null references products(id) on delete cascade,
    title varchar(160) not null,
    sku varchar(100) unique,
    price numeric(14, 2) not null,
    compare_at_price numeric(14, 2),
    stock_quantity integer not null default 0,
    active boolean not null default true,
    sort_order integer not null default 0
);

create index idx_product_variants_product_id on product_variants(product_id);
create index idx_product_variants_active on product_variants(active);

create table product_gallery_images (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    product_id bigint not null references products(id) on delete cascade,
    media_asset_id bigint not null references media_assets(id) on delete restrict,
    alt_text varchar(255),
    primary_image boolean not null default false,
    sort_order integer not null default 0,
    unique (product_id, media_asset_id)
);

create index idx_product_gallery_images_product_id on product_gallery_images(product_id);

create table product_attribute_assignments (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    product_id bigint not null references products(id) on delete cascade,
    attribute_id bigint not null references product_attributes(id) on delete restrict,
    attribute_value_id bigint references product_attribute_values(id) on delete restrict,
    value_text varchar(500),
    value_number numeric(14, 2),
    value_boolean boolean,
    sort_order integer not null default 0
);

create index idx_product_attribute_assignments_product_id on product_attribute_assignments(product_id);
create index idx_product_attribute_assignments_attribute_id on product_attribute_assignments(attribute_id);
create index idx_product_attribute_assignments_attribute_value_id on product_attribute_assignments(attribute_value_id);
