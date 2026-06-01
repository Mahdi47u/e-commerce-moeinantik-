package com.moeinantik.shop.feature.attribute.repository;

import com.moeinantik.shop.feature.attribute.entity.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, Long> {

    List<ProductAttribute> findAllByOrderBySortOrderAscNameAsc();

    List<ProductAttribute> findAllByActiveTrueOrderBySortOrderAscNameAsc();

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
