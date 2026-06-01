package com.moeinantik.shop.feature.product.repository;

import com.moeinantik.shop.feature.product.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    boolean existsBySku(String sku);

    boolean existsBySkuAndProductIdNot(String sku, Long productId);
}
