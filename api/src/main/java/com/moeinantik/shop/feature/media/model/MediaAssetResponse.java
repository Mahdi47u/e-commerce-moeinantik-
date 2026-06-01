package com.moeinantik.shop.feature.media.model;

import java.time.LocalDateTime;

public record MediaAssetResponse(
        Long id,
        LocalDateTime createdAt,
        String fileName,
        String originalFileName,
        String contentType,
        Long sizeBytes,
        String objectKey,
        String url,
        String altText,
        Integer width,
        Integer height
) {
}
