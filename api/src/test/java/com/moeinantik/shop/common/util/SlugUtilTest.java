package com.moeinantik.shop.common.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SlugUtilTest {

    @Test
    void fromCreatesStableSlug() {
        assertThat(SlugUtil.from(" Luxury Antique Vase "))
                .isEqualTo("luxury-antique-vase");
    }

    @Test
    void fromKeepsPersianLetters() {
        assertThat(SlugUtil.from("گلدان آنتیک خاص"))
                .isEqualTo("گلدان-آنتیک-خاص");
    }

    @Test
    void fromReturnsEmptyStringForBlankInput() {
        assertThat(SlugUtil.from("   "))
                .isEmpty();
    }
}
