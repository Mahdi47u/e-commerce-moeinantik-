package com.moeinantik.shop.feature.attribute.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.feature.attribute.entity.AttributeType;
import com.moeinantik.shop.feature.attribute.entity.ProductAttribute;
import com.moeinantik.shop.feature.attribute.mapper.AttributeMapper;
import com.moeinantik.shop.feature.attribute.model.AttributeValueRequest;
import com.moeinantik.shop.feature.attribute.repository.ProductAttributeRepository;
import com.moeinantik.shop.feature.attribute.repository.ProductAttributeValueRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AttributeServiceTest {

    private final ProductAttributeRepository attributeRepository = mock(ProductAttributeRepository.class);
    private final ProductAttributeValueRepository valueRepository = mock(ProductAttributeValueRepository.class);
    private final AttributeService attributeService = new AttributeService(
            attributeRepository,
            valueRepository,
            new AttributeMapper()
    );

    @Test
    void createValueRejectsNonSelectAttribute() {
        ProductAttribute attribute = new ProductAttribute();
        attribute.setId(7L);
        attribute.setName("Material note");
        attribute.setSlug("material-note");
        attribute.setType(AttributeType.TEXT);

        AttributeValueRequest request = new AttributeValueRequest();
        request.setValue("Bronze");

        when(attributeRepository.findById(7L)).thenReturn(Optional.of(attribute));

        assertThatThrownBy(() -> attributeService.createValue(7L, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Only SELECT and MULTI_SELECT attributes can have predefined values");
    }
}
