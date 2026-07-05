package com.moeinantik.shop.feature.blog.model;

import java.time.LocalDateTime;

public record BlogPostResponse(
        Long id,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String title,
        String slug,
        String excerpt,
        String content,
        String coverImageUrl,
        BlogCategoryResponse category,
        String authorName,
        boolean published,
        LocalDateTime publishedAt,
        boolean featured,
        Integer readingMinutes,
        String seoTitle,
        String seoDescription
) {
}
