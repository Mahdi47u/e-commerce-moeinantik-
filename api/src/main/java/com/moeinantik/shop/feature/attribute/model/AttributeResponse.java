package com.moeinantik.shop.feature.attribute.model;

import com.moeinantik.shop.feature.attribute.entity.AttributeType;

import java.time.LocalDateTime;
import java.util.List;

public record AttributeResponse(
        Long id,
        LocalDateTime createdAt,
        String name,
        String slug,
        AttributeType type,
        boolean filterable,
        boolean active,
        Integer sortOrder,
        List<AttributeValueResponse> values
) {
}
