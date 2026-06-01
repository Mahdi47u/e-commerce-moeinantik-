package com.moeinantik.shop.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "payment.zarinpal")
public record ZarinPalProperties(
        String merchantId,
        String requestUrl,
        String verifyUrl,
        String startPayUrl,
        String callbackUrl,
        String frontendResultUrl,
        String currency
) {
}
