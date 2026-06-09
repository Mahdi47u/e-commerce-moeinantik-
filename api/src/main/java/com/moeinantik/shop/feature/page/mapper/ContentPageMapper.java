package com.moeinantik.shop.feature.page.mapper;

import com.moeinantik.shop.feature.page.entity.ContentPage;
import com.moeinantik.shop.feature.page.model.ContentPageResponse;
import org.springframework.stereotype.Component;

@Component
public class ContentPageMapper {

    public ContentPageResponse toResponse(ContentPage page) {
        return new ContentPageResponse(
                page.getId(),
                page.getCreatedAt(),
                page.getTitle(),
                page.getSlug(),
                page.getExcerpt(),
                page.getContent(),
                page.isPublished(),
                page.getSeoTitle(),
                page.getSeoDescription()
        );
    }
}
