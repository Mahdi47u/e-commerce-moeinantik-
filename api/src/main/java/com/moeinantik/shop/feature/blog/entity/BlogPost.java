package com.moeinantik.shop.feature.blog.entity;

import com.moeinantik.shop.common.entity.BaseEntity;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "blog_posts")
public class BlogPost extends BaseEntity {

    @Column(nullable = false, length = 220)
    private String title;

    @Column(nullable = false, unique = true, length = 240)
    private String slug;

    @Column(length = 600)
    private String excerpt;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(length = 700)
    private String coverImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private BlogCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private UserEntity author;

    @Column(nullable = false)
    private boolean published;

    private LocalDateTime publishedAt;

    @Column(nullable = false)
    private boolean featured;

    @Column(nullable = false)
    private Integer readingMinutes = 1;

    @Column(length = 180)
    private String seoTitle;

    @Column(length = 300)
    private String seoDescription;
}
