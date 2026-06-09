package com.moeinantik.shop.feature.homepage.mapper;

import com.moeinantik.shop.feature.homepage.entity.HomepageSection;
import com.moeinantik.shop.feature.homepage.model.HomepageSectionResponse;
import org.springframework.stereotype.Component;

@Component
public class HomepageSectionMapper {

    public HomepageSectionResponse toResponse(HomepageSection section) {
        return new HomepageSectionResponse(
                section.getId(),
                section.getTitle(),
                section.getSubtitle(),
                section.getType(),
                section.isActive(),
                section.getSortOrder(),
                section.getCtaLabel(),
                section.getCtaHref()
        );
    }
}
