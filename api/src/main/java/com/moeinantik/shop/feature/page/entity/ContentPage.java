package com.moeinantik.shop.feature.page.entity;

import com.moeinantik.shop.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "content_pages")
public class ContentPage extends BaseEntity {

    @Column(nullable = false, length = 220)
    private String title;

    @Column(nullable = false, unique = true, length = 240)
    private String slug;

    @Column(length = 500)
    private String excerpt;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(nullable = false)
    private boolean published;

    @Column(length = 180)
    private String seoTitle;

    @Column(length = 300)
    private String seoDescription;
}
