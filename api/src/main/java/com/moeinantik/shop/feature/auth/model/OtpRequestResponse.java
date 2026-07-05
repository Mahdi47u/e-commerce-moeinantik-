package com.moeinantik.shop.feature.auth.model;

public record OtpRequestResponse(
        String phone,
        long expiresInSeconds,
        long resendAfterSeconds
) {
}
