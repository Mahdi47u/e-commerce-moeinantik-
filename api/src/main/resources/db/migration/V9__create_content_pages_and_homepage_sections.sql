create table content_pages (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    title varchar(220) not null,
    slug varchar(240) not null unique,
    excerpt varchar(500),
    content text not null,
    published boolean not null default false,
    seo_title varchar(180),
    seo_description varchar(300)
);

create index idx_content_pages_published on content_pages(published);

create table homepage_sections (
    id bigserial primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    title varchar(220) not null,
    subtitle varchar(500),
    type varchar(40) not null,
    active boolean not null default true,
    sort_order integer not null default 0,
    cta_label varchar(120),
    cta_href varchar(500)
);

create index idx_homepage_sections_active on homepage_sections(active);
create index idx_homepage_sections_sort_order on homepage_sections(sort_order);
