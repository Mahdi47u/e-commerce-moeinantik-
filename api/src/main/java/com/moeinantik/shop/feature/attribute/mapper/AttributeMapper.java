package com.moeinantik.shop.feature.attribute.mapper;

import com.moeinantik.shop.feature.attribute.entity.ProductAttribute;
import com.moeinantik.shop.feature.attribute.entity.ProductAttributeValue;
import com.moeinantik.shop.feature.attribute.model.AttributeResponse;
import com.moeinantik.shop.feature.attribute.model.AttributeValueResponse;
import org.springframework.stereotype.Component;

@Component
public class AttributeMapper {

    public AttributeResponse toResponse(ProductAttribute attribute) {
        return toResponse(attribute, false);
    }

    public AttributeResponse toResponse(ProductAttribute attribute, boolean activeValuesOnly) {
        return new AttributeResponse(
                attribute.getId(),
                attribute.getCreatedAt(),
                attribute.getName(),
                attribute.getSlug(),
                attribute.getType(),
                attribute.isFilterable(),
                attribute.isActive(),
                attribute.getSortOrder(),
                attribute.getValues().stream()
                        .filter(value -> !activeValuesOnly || value.isActive())
                        .map(this::toValueResponse)
                        .toList()
        );
    }

    public AttributeValueResponse toValueResponse(ProductAttributeValue value) {
        return new AttributeValueResponse(
                value.getId(),
                value.getValue(),
                value.getSlug(),
                value.getSortOrder(),
                value.isActive()
        );
    }
}
