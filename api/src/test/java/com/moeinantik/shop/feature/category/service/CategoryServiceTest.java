package com.moeinantik.shop.feature.category.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.feature.category.entity.Category;
import com.moeinantik.shop.feature.category.mapper.CategoryMapper;
import com.moeinantik.shop.feature.category.model.CategoryRequest;
import com.moeinantik.shop.feature.category.model.CategoryResponse;
import com.moeinantik.shop.feature.category.repository.CategoryRepository;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CategoryServiceTest {

    private final CategoryRepository categoryRepository = mock(CategoryRepository.class);
    private final CategoryService categoryService = new CategoryService(categoryRepository, new CategoryMapper());

    @Test
    void createGeneratesSlugFromName() {
        CategoryRequest request = new CategoryRequest();
        request.setName("Decorative Objects");

        when(categoryRepository.existsBySlug("decorative-objects")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category category = invocation.getArgument(0);
            category.setId(10L);
            return category;
        });

        CategoryResponse response = categoryService.create(request);

        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.slug()).isEqualTo("decorative-objects");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void createRejectsDuplicateSlug() {
        CategoryRequest request = new CategoryRequest();
        request.setName("Lighting");

        when(categoryRepository.existsBySlug("lighting")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.create(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Category slug is already used");
    }
}
