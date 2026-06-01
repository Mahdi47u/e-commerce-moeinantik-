create table payment_transactions (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    order_id bigint not null references orders(id) on delete cascade,
    gateway varchar(40) not null,
    authority varchar(120) unique,
    ref_id varchar(120),
    amount numeric(14, 2) not null,
    status varchar(30) not null,
    failure_reason varchar(500)
);

create index idx_payment_transactions_order_id on payment_transactions(order_id);
create index idx_payment_transactions_status on payment_transactions(status);
