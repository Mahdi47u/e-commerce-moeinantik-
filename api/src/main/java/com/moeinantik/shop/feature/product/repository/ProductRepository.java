package com.moeinantik.shop.feature.product.repository;

import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = "category")
    List<Product> findAllByOrderBySortOrderAscCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = "category")
    List<Product> findAllByStatusOrderBySortOrderAscCreatedAtDesc(ProductStatus status, Pageable pageable);

    @EntityGraph(attributePaths = "category")
    List<Product> findFirst6ByStatusAndFeaturedTrueOrderBySortOrderAscCreatedAtDesc(ProductStatus status);

    @EntityGraph(attributePaths = "category")
    List<Product> findAllByCategorySlugAndStatusOrderBySortOrderAscCreatedAtDesc(
            String categorySlug,
            ProductStatus status,
            Pageable pageable
    );

    @EntityGraph(attributePaths = "category")
    Optional<Product> findBySlug(String slug);

    @Override
    @EntityGraph(attributePaths = "category")
    Optional<Product> findById(Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);
}
