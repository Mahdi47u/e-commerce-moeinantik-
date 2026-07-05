create table if not exists blog_categories (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    name varchar(160) not null,
    slug varchar(180) not null unique,
    description varchar(500),
    active boolean not null default true,
    sort_order integer not null default 0
);

create table if not exists blog_posts (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    title varchar(220) not null,
    slug varchar(240) not null unique,
    excerpt varchar(600),
    content text not null,
    cover_image_url varchar(700),
    category_id bigint references blog_categories(id),
    author_id bigint references users(id),
    published boolean not null default false,
    published_at timestamp,
    featured boolean not null default false,
    reading_minutes integer not null default 1,
    seo_title varchar(180),
    seo_description varchar(300)
);

create index if not exists ix_blog_posts_published_dates
    on blog_posts(published, published_at desc, created_at desc);

create index if not exists ix_blog_posts_category
    on blog_posts(category_id);
