package com.moeinantik.shop.feature.attribute.model;

public record AttributeValueResponse(
        Long id,
        String value,
        String slug,
        Integer sortOrder,
        boolean active
) {
}
