package com.moeinantik.shop.feature.homepage.service;

import com.moeinantik.shop.feature.category.mapper.CategoryMapper;
import com.moeinantik.shop.feature.category.repository.CategoryRepository;
import com.moeinantik.shop.feature.homepage.mapper.HomepageSectionMapper;
import com.moeinantik.shop.feature.homepage.model.HomepageResponse;
import com.moeinantik.shop.feature.homepage.repository.HomepageSectionRepository;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import com.moeinantik.shop.feature.product.mapper.ProductMapper;
import com.moeinantik.shop.feature.product.repository.ProductRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class HomepageServiceTest {

    private final HomepageSectionRepository sectionRepository = mock(HomepageSectionRepository.class);
    private final ProductRepository productRepository = mock(ProductRepository.class);
    private final CategoryRepository categoryRepository = mock(CategoryRepository.class);
    private final HomepageService homepageService = new HomepageService(
            sectionRepository,
            productRepository,
            categoryRepository,
            new HomepageSectionMapper(),
            new ProductMapper(),
            new CategoryMapper()
    );

    @Test
    void getPublicReturnsEmptyCollectionsWhenNoContentExists() {
        when(sectionRepository.findAllByActiveTrueOrderBySortOrderAscCreatedAtDesc()).thenReturn(List.of());
        when(productRepository.findFirst6ByStatusAndFeaturedTrueOrderBySortOrderAscCreatedAtDesc(ProductStatus.ACTIVE)).thenReturn(List.of());
        when(categoryRepository.findAllByActiveTrueOrderBySortOrderAscNameAsc()).thenReturn(List.of());

        HomepageResponse response = homepageService.getPublic();

        assertThat(response.sections()).isEmpty();
        assertThat(response.featuredProducts()).isEmpty();
        assertThat(response.categories()).isEmpty();
        assertThat(response.seoTitle()).contains("Moein Antik");
    }
}
