package com.moeinantik.shop.feature.cart.model;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Long id,
        List<CartItemResponse> items,
        Integer itemCount,
        BigDecimal subtotal
) {
}
