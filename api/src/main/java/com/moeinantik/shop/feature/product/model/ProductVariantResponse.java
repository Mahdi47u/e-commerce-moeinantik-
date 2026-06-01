package com.moeinantik.shop.feature.product.model;

import java.math.BigDecimal;

public record ProductVariantResponse(
        Long id,
        String title,
        String sku,
        BigDecimal price,
        BigDecimal compareAtPrice,
        Integer stockQuantity,
        boolean active,
        Integer sortOrder
) {
}
