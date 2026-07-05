package com.moeinantik.shop.common.cache;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CacheKeyBuilderTest {

    private final CacheKeyBuilder keyBuilder = new CacheKeyBuilder(new CacheProperties("moein-antik"));

    @Test
    void buildsNamespacedKeys() {
        String key = keyBuilder.build("otp", "+98 912 345 6789");

        assertThat(key).isEqualTo("moein-antik:otp:98-912-345-6789");
    }

    @Test
    void buildsNamespaceOnlyKey() {
        String key = keyBuilder.build("homepage");

        assertThat(key).isEqualTo("moein-antik:homepage");
    }
}
