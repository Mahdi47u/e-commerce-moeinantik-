package com.moeinantik.shop.common.cache;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "cache")
public record CacheProperties(String keyPrefix) {

    public CacheProperties {
        if (keyPrefix == null || keyPrefix.isBlank()) {
            keyPrefix = "moein-antik";
        }
    }
}
