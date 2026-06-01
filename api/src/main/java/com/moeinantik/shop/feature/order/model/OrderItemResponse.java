package com.moeinantik.shop.feature.order.model;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long productId,
        Long productVariantId,
        String productName,
        String productSlug,
        String variantTitle,
        String sku,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal lineTotal,
        String imageUrl
) {
}
