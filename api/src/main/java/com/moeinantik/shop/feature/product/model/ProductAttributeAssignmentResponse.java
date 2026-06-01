package com.moeinantik.shop.feature.product.model;

import java.math.BigDecimal;

public record ProductAttributeAssignmentResponse(
        Long id,
        Long attributeId,
        String attributeName,
        String attributeSlug,
        Long attributeValueId,
        String attributeValue,
        String valueText,
        BigDecimal valueNumber,
        Boolean valueBoolean,
        Integer sortOrder
) {
}
