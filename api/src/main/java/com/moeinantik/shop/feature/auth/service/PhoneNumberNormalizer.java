package com.moeinantik.shop.feature.auth.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import org.springframework.stereotype.Component;

@Component
public class PhoneNumberNormalizer {

    public String normalize(String rawPhone) {
        if (rawPhone == null) {
            throw new BadRequestException("Phone number is required");
        }

        String digits = rawPhone
                .replaceAll("[^0-9+]", "")
                .replaceFirst("^00", "+");

        if (digits.startsWith("+98")) {
            digits = "0" + digits.substring(3);
        }

        if (digits.startsWith("98") && digits.length() == 12) {
            digits = "0" + digits.substring(2);
        }

        if (!digits.matches("09\\d{9}")) {
            throw new BadRequestException("Invalid phone number");
        }

        return digits;
    }
}
