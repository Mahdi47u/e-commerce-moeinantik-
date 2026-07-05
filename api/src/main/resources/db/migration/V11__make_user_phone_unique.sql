create unique index if not exists ux_users_phone_not_null
    on users(phone)
    where phone is not null;
