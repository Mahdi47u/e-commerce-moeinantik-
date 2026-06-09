package com.moeinantik.shop.feature.page.model;

import java.time.LocalDateTime;

public record ContentPageResponse(
        Long id,
        LocalDateTime createdAt,
        String title,
        String slug,
        String excerpt,
        String content,
        boolean published,
        String seoTitle,
        String seoDescription
) {
}
