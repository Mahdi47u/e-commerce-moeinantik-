package com.moeinantik.shop.common.util;

public final class SlugUtil {

    private SlugUtil() {
    }

    public static String from(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        return value
                .trim()
                .toLowerCase()
                .replaceAll("[^\\p{IsAlphabetic}\\p{IsDigit}\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}
