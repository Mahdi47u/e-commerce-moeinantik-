create table carts (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    user_id bigint not null unique references users(id) on delete cascade
);

create table cart_items (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    cart_id bigint not null references carts(id) on delete cascade,
    product_variant_id bigint not null references product_variants(id) on delete cascade,
    quantity integer not null,
    unique (cart_id, product_variant_id)
);

create index idx_cart_items_cart_id on cart_items(cart_id);
create index idx_cart_items_product_variant_id on cart_items(product_variant_id);
