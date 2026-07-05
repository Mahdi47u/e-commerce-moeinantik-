package com.moeinantik.shop.feature.blog.mapper;

import com.moeinantik.shop.feature.blog.entity.BlogCategory;
import com.moeinantik.shop.feature.blog.entity.BlogPost;
import com.moeinantik.shop.feature.blog.model.BlogCategoryResponse;
import com.moeinantik.shop.feature.blog.model.BlogPostResponse;
import org.springframework.stereotype.Component;

@Component
public class BlogMapper {

    public BlogCategoryResponse toCategoryResponse(BlogCategory category) {
        if (category == null) {
            return null;
        }

        return new BlogCategoryResponse(
                category.getId(),
                category.getCreatedAt(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.isActive(),
                category.getSortOrder()
        );
    }

    public BlogPostResponse toPostResponse(BlogPost post) {
        String authorName = null;
        if (post.getAuthor() != null) {
            String fullName = String.join(" ",
                    safe(post.getAuthor().getFirstName()),
                    safe(post.getAuthor().getLastName())
            ).trim();
            authorName = fullName.isBlank() ? post.getAuthor().getUsername() : fullName;
        }

        return new BlogPostResponse(
                post.getId(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getTitle(),
                post.getSlug(),
                post.getExcerpt(),
                post.getContent(),
                post.getCoverImageUrl(),
                toCategoryResponse(post.getCategory()),
                authorName,
                post.isPublished(),
                post.getPublishedAt(),
                post.isFeatured(),
                post.getReadingMinutes(),
                post.getSeoTitle(),
                post.getSeoDescription()
        );
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
