package com.moeinantik.shop.feature.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

@ConfigurationProperties(prefix = "auth.otp")
public record OtpProperties(
        int codeLength,
        Duration ttl,
        Duration resendCooldown,
        Duration requestWindow,
        int maxRequestsPerWindow,
        int maxVerifyAttempts,
        String devCode,
        List<String> adminPhones
) {

    public OtpProperties {
        if (codeLength <= 0) {
            codeLength = 6;
        }
        if (ttl == null) {
            ttl = Duration.ofMinutes(2);
        }
        if (resendCooldown == null) {
            resendCooldown = Duration.ofSeconds(60);
        }
        if (requestWindow == null) {
            requestWindow = Duration.ofMinutes(15);
        }
        if (maxRequestsPerWindow <= 0) {
            maxRequestsPerWindow = 5;
        }
        if (maxVerifyAttempts <= 0) {
            maxVerifyAttempts = 5;
        }
        if (devCode != null && devCode.isBlank()) {
            devCode = null;
        }
        if (adminPhones == null) {
            adminPhones = List.of();
        }
    }
}
