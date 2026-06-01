package com.moeinantik.shop.feature.payment.model;

public record StartPaymentResponse(
        Long orderId,
        String authority,
        String paymentUrl
) {
}
