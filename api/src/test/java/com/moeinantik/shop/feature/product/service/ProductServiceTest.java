package com.moeinantik.shop.feature.product.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.feature.attribute.repository.ProductAttributeRepository;
import com.moeinantik.shop.feature.attribute.repository.ProductAttributeValueRepository;
import com.moeinantik.shop.feature.category.repository.CategoryRepository;
import com.moeinantik.shop.feature.media.entity.MediaAsset;
import com.moeinantik.shop.feature.media.repository.MediaAssetRepository;
import com.moeinantik.shop.feature.product.mapper.ProductMapper;
import com.moeinantik.shop.feature.product.model.ProductGalleryImageRequest;
import com.moeinantik.shop.feature.product.model.ProductRequest;
import com.moeinantik.shop.feature.product.repository.ProductRepository;
import com.moeinantik.shop.feature.product.repository.ProductVariantRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ProductServiceTest {

    private final ProductRepository productRepository = mock(ProductRepository.class);
    private final ProductVariantRepository variantRepository = mock(ProductVariantRepository.class);
    private final CategoryRepository categoryRepository = mock(CategoryRepository.class);
    private final MediaAssetRepository mediaAssetRepository = mock(MediaAssetRepository.class);
    private final ProductAttributeRepository attributeRepository = mock(ProductAttributeRepository.class);
    private final ProductAttributeValueRepository attributeValueRepository = mock(ProductAttributeValueRepository.class);
    private final ProductService productService = new ProductService(
            productRepository,
            variantRepository,
            categoryRepository,
            mediaAssetRepository,
            attributeRepository,
            attributeValueRepository,
            new ProductMapper()
    );

    @Test
    void createRejectsDuplicateGalleryMediaAssets() {
        ProductRequest request = new ProductRequest();
        request.setName("Antique Mirror");

        ProductGalleryImageRequest firstImage = new ProductGalleryImageRequest();
        firstImage.setMediaAssetId(9L);

        ProductGalleryImageRequest secondImage = new ProductGalleryImageRequest();
        secondImage.setMediaAssetId(9L);

        request.setGalleryImages(List.of(firstImage, secondImage));

        MediaAsset mediaAsset = new MediaAsset();
        mediaAsset.setId(9L);
        when(mediaAssetRepository.findById(9L)).thenReturn(Optional.of(mediaAsset));

        assertThatThrownBy(() -> productService.create(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Product gallery contains duplicate media assets");
    }
}
