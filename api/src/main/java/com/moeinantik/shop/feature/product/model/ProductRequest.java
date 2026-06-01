package com.moeinantik.shop.feature.product.model;

import com.moeinantik.shop.feature.product.entity.ProductStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ProductRequest {

    @NotBlank
    @Size(max = 220)
    private String name;

    @Size(max = 240)
    private String slug;

    @Size(max = 80)
    private String sku;

    @Size(max = 500)
    private String shortDescription;

    private String description;

    private Long categoryId;

    private ProductStatus status = ProductStatus.DRAFT;

    private Boolean featured = false;

    private Integer sortOrder = 0;

    @Size(max = 180)
    private String seoTitle;

    @Size(max = 300)
    private String seoDescription;

    @Valid
    private List<ProductVariantRequest> variants = new ArrayList<>();

    @Valid
    private List<ProductGalleryImageRequest> galleryImages = new ArrayList<>();

    @Valid
    private List<ProductAttributeAssignmentRequest> attributes = new ArrayList<>();
}
