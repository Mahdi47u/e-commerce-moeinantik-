package com.moeinantik.shop.feature.attribute.repository;

import com.moeinantik.shop.feature.attribute.entity.ProductAttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductAttributeValueRepository extends JpaRepository<ProductAttributeValue, Long> {

    boolean existsByAttributeIdAndSlug(Long attributeId, String slug);

    boolean existsByAttributeIdAndSlugAndIdNot(Long attributeId, String slug, Long id);
}
