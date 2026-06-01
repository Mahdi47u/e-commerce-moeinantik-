package com.moeinantik.shop.feature.product.mapper;

import com.moeinantik.shop.feature.attribute.entity.AttributeType;
import com.moeinantik.shop.feature.attribute.entity.ProductAttribute;
import com.moeinantik.shop.feature.attribute.entity.ProductAttributeValue;
import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductAttributeAssignment;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import com.moeinantik.shop.feature.product.entity.ProductVariant;
import com.moeinantik.shop.feature.product.model.ProductResponse;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class ProductMapperTest {

    private final ProductMapper productMapper = new ProductMapper();

    @Test
    void publicViewHidesInactiveVariantsAndInactiveAttributeValues() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Antique Vase");
        product.setSlug("antique-vase");
        product.setStatus(ProductStatus.ACTIVE);

        ProductVariant inactiveVariant = new ProductVariant();
        inactiveVariant.setId(2L);
        inactiveVariant.setProduct(product);
        inactiveVariant.setTitle("Default");
        inactiveVariant.setPrice(BigDecimal.TEN);
        inactiveVariant.setActive(false);
        product.getVariants().add(inactiveVariant);

        ProductAttribute attribute = new ProductAttribute();
        attribute.setId(3L);
        attribute.setName("Material");
        attribute.setSlug("material");
        attribute.setType(AttributeType.SELECT);
        attribute.setActive(true);

        ProductAttributeValue inactiveValue = new ProductAttributeValue();
        inactiveValue.setId(4L);
        inactiveValue.setAttribute(attribute);
        inactiveValue.setValue("Bronze");
        inactiveValue.setSlug("bronze");
        inactiveValue.setActive(false);

        ProductAttributeAssignment assignment = new ProductAttributeAssignment();
        assignment.setId(5L);
        assignment.setProduct(product);
        assignment.setAttribute(attribute);
        assignment.setAttributeValue(inactiveValue);
        product.getAttributeAssignments().add(assignment);

        ProductResponse response = productMapper.toResponse(product, true);

        assertThat(response.variants()).isEmpty();
        assertThat(response.attributes()).isEmpty();
    }
}
