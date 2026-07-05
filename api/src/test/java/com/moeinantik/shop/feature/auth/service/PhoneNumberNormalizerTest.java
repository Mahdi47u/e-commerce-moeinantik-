package com.moeinantik.shop.feature.auth.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PhoneNumberNormalizerTest {

    private final PhoneNumberNormalizer normalizer = new PhoneNumberNormalizer();

    @Test
    void normalizesIranMobileNumbers() {
        assertThat(normalizer.normalize("+98 912 345 6789")).isEqualTo("09123456789");
        assertThat(normalizer.normalize("989123456789")).isEqualTo("09123456789");
        assertThat(normalizer.normalize("0912-345-6789")).isEqualTo("09123456789");
    }

    @Test
    void rejectsInvalidPhoneNumbers() {
        assertThatThrownBy(() -> normalizer.normalize("02112345678"))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Invalid phone number");
    }
}
