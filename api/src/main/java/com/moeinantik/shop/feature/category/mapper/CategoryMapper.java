package com.moeinantik.shop.feature.category.mapper;

import com.moeinantik.shop.feature.category.entity.Category;
import com.moeinantik.shop.feature.category.model.CategoryResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        return toResponse(category, List.of());
    }

    public CategoryResponse toResponse(Category category, List<CategoryResponse> children) {
        return new CategoryResponse(
                category.getId(),
                category.getCreatedAt(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getParent() == null ? null : category.getParent().getId(),
                category.isActive(),
                category.getSortOrder(),
                category.getSeoTitle(),
                category.getSeoDescription(),
                children
        );
    }
}
