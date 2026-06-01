package com.moeinantik.shop.feature.category.model;

import java.time.LocalDateTime;
import java.util.List;

public record CategoryResponse(
        Long id,
        LocalDateTime createdAt,
        String name,
        String slug,
        String description,
        Long parentId,
        boolean active,
        Integer sortOrder,
        String seoTitle,
        String seoDescription,
        List<CategoryResponse> children
) {
}
