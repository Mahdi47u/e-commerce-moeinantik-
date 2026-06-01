package com.moeinantik.shop.feature.order.model;

import com.moeinantik.shop.feature.order.entity.OrderStatus;
import com.moeinantik.shop.feature.order.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        LocalDateTime createdAt,
        String orderNumber,
        OrderStatus status,
        PaymentStatus paymentStatus,
        BigDecimal subtotal,
        BigDecimal shippingCost,
        BigDecimal total,
        String customerName,
        String customerPhone,
        String customerEmail,
        String province,
        String city,
        String addressLine,
        String postalCode,
        String note,
        List<OrderItemResponse> items
) {
}
