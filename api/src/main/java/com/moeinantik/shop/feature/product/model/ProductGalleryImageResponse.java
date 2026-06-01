package com.moeinantik.shop.feature.product.model;

public record ProductGalleryImageResponse(
        Long id,
        Long mediaAssetId,
        String url,
        String altText,
        boolean primaryImage,
        Integer sortOrder,
        Integer width,
        Integer height
) {
}
