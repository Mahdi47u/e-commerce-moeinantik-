package com.moeinantik.shop.feature.cart.model;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String productSlug,
        Long productVariantId,
        String variantTitle,
        String sku,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal lineTotal,
        String imageUrl
) {
}
