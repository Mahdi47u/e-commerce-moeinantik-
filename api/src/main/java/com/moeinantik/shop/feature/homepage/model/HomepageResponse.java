package com.moeinantik.shop.feature.homepage.model;

import com.moeinantik.shop.feature.category.model.CategoryResponse;
import com.moeinantik.shop.feature.product.model.ProductResponse;

import java.util.List;

public record HomepageResponse(
        List<HomepageSectionResponse> sections,
        List<ProductResponse> featuredProducts,
        List<CategoryResponse> categories,
        String seoTitle,
        String seoDescription
) {
}
