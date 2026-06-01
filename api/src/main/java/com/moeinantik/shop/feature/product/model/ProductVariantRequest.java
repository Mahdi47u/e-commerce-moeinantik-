package com.moeinantik.shop.feature.product.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductVariantRequest {

    @NotBlank
    @Size(max = 160)
    private String title;

    @Size(max = 100)
    private String sku;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @DecimalMin("0.0")
    private BigDecimal compareAtPrice;

    @PositiveOrZero
    private Integer stockQuantity = 0;

    private Boolean active = true;

    private Integer sortOrder = 0;
}
