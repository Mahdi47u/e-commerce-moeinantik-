package com.moeinantik.shop.feature.product.model;

import com.moeinantik.shop.feature.product.entity.ProductStatus;

import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
        Long id,
        LocalDateTime createdAt,
        String name,
        String slug,
        String sku,
        String shortDescription,
        String description,
        Long categoryId,
        String categoryName,
        ProductStatus status,
        boolean featured,
        Integer sortOrder,
        String seoTitle,
        String seoDescription,
        List<ProductVariantResponse> variants,
        List<ProductGalleryImageResponse> galleryImages,
        List<ProductAttributeAssignmentResponse> attributes
) {
}
