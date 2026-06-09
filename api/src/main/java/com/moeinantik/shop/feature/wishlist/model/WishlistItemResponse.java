package com.moeinantik.shop.feature.wishlist.model;

import com.moeinantik.shop.feature.product.model.ProductResponse;

import java.time.LocalDateTime;

public record WishlistItemResponse(
        Long id,
        LocalDateTime createdAt,
        ProductResponse product
) {
}
