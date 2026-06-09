package com.moeinantik.shop.feature.homepage.entity;

import com.moeinantik.shop.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "homepage_sections")
public class HomepageSection extends BaseEntity {

    @Column(nullable = false, length = 220)
    private String title;

    @Column(length = 500)
    private String subtitle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private HomepageSectionType type = HomepageSectionType.CUSTOM;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private Integer sortOrder = 0;

    @Column(length = 120)
    private String ctaLabel;

    @Column(length = 500)
    private String ctaHref;
}
