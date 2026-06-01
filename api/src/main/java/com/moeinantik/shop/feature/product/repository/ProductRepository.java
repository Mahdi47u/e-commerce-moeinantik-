package com.moeinantik.shop.feature.product.repository;

import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderBySortOrderAscCreatedAtDesc();

    List<Product> findAllByStatusOrderBySortOrderAscCreatedAtDesc(ProductStatus status);

    List<Product> findAllByCategorySlugAndStatusOrderBySortOrderAscCreatedAtDesc(String categorySlug, ProductStatus status);

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);
}
