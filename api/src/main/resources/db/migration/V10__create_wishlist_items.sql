create table wishlist_items (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    user_id bigint not null references users(id) on delete cascade,
    product_id bigint not null references products(id) on delete cascade,
    unique (user_id, product_id)
);

create index idx_wishlist_items_user_id on wishlist_items(user_id);
create index idx_wishlist_items_product_id on wishlist_items(product_id);
