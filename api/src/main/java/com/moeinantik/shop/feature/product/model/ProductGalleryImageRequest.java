package com.moeinantik.shop.feature.product.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductGalleryImageRequest {

    @NotNull
    private Long mediaAssetId;

    @Size(max = 255)
    private String altText;

    private Boolean primaryImage = false;

    private Integer sortOrder = 0;
}
