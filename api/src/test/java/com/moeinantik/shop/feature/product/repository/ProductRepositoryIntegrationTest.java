package com.moeinantik.shop.feature.product.repository;

import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class ProductRepositoryIntegrationTest {

    @Autowired
    private ProductRepository productRepository;

    @Test
    void publicProductListingSupportsPagination() {
        productRepository.save(product("first", 1));
        productRepository.save(product("second", 2));
        productRepository.save(product("third", 3));

        List<Product> firstPage = productRepository.findAllByStatusOrderBySortOrderAscCreatedAtDesc(
                ProductStatus.ACTIVE,
                PageRequest.of(0, 2)
        );
        List<Product> secondPage = productRepository.findAllByStatusOrderBySortOrderAscCreatedAtDesc(
                ProductStatus.ACTIVE,
                PageRequest.of(1, 2)
        );

        assertThat(firstPage).hasSize(2);
        assertThat(secondPage).hasSize(1);
        assertThat(firstPage).extracting(Product::getSlug).containsExactly("first", "second");
        assertThat(secondPage).extracting(Product::getSlug).containsExactly("third");
    }

    private Product product(String slug, int sortOrder) {
        Product product = new Product();
        product.setName(slug);
        product.setSlug(slug);
        product.setStatus(ProductStatus.ACTIVE);
        product.setSortOrder(sortOrder);
        return product;
    }
}
