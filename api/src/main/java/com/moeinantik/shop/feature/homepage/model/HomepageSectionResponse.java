package com.moeinantik.shop.feature.homepage.model;

import com.moeinantik.shop.feature.homepage.entity.HomepageSectionType;

public record HomepageSectionResponse(
        Long id,
        String title,
        String subtitle,
        HomepageSectionType type,
        boolean active,
        Integer sortOrder,
        String ctaLabel,
        String ctaHref
) {
}
