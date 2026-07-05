package com.moeinantik.shop.common.cache;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.stream.Collectors;

@Component
public class CacheKeyBuilder {

    private final String prefix;

    public CacheKeyBuilder(CacheProperties properties) {
        this.prefix = sanitize(properties.keyPrefix());
    }

    public String build(String namespace, Object... parts) {
        String suffix = Arrays.stream(parts)
                .map(String::valueOf)
                .map(this::sanitize)
                .collect(Collectors.joining(":"));

        if (suffix.isBlank()) {
            return prefix + ":" + sanitize(namespace);
        }

        return prefix + ":" + sanitize(namespace) + ":" + suffix;
    }

    private String sanitize(String value) {
        return value.trim()
                .toLowerCase()
                .replaceAll("[^a-z0-9._-]+", "-")
                .replaceAll("^-+|-+$", "");
    }
}
