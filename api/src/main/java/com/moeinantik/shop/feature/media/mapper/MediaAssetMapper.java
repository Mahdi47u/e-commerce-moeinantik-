package com.moeinantik.shop.feature.media.mapper;

import com.moeinantik.shop.feature.media.entity.MediaAsset;
import com.moeinantik.shop.feature.media.model.MediaAssetResponse;
import org.springframework.stereotype.Component;

@Component
public class MediaAssetMapper {

    public MediaAssetResponse toResponse(MediaAsset asset) {
        return new MediaAssetResponse(
                asset.getId(),
                asset.getCreatedAt(),
                asset.getFileName(),
                asset.getOriginalFileName(),
                asset.getContentType(),
                asset.getSizeBytes(),
                asset.getObjectKey(),
                asset.getUrl(),
                asset.getAltText(),
                asset.getWidth(),
                asset.getHeight()
        );
    }
}
