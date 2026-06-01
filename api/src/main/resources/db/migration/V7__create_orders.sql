create table orders (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    order_number varchar(40) not null unique,
    user_id bigint not null references users(id) on delete restrict,
    status varchar(30) not null,
    payment_status varchar(30) not null,
    subtotal numeric(14, 2) not null,
    shipping_cost numeric(14, 2) not null default 0,
    total numeric(14, 2) not null,
    customer_name varchar(180) not null,
    customer_phone varchar(40) not null,
    customer_email varchar(180),
    province varchar(120) not null,
    city varchar(120) not null,
    address_line varchar(500) not null,
    postal_code varchar(40),
    note varchar(500)
);

create index idx_orders_user_id on orders(user_id);
create index idx_orders_status on orders(status);
create index idx_orders_created_at on orders(created_at);

create table order_items (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    order_id bigint not null references orders(id) on delete cascade,
    product_id bigint references products(id) on delete set null,
    product_variant_id bigint references product_variants(id) on delete set null,
    product_name varchar(220) not null,
    product_slug varchar(240) not null,
    variant_title varchar(160) not null,
    sku varchar(100),
    unit_price numeric(14, 2) not null,
    quantity integer not null,
    line_total numeric(14, 2) not null,
    image_url varchar(1000)
);

create index idx_order_items_order_id on order_items(order_id);
