package com.moeinantik.shop.feature.blog.model;

import java.time.LocalDateTime;

public record BlogCategoryResponse(
        Long id,
        LocalDateTime createdAt,
        String name,
        String slug,
        String description,
        boolean active,
        Integer sortOrder
) {
}
