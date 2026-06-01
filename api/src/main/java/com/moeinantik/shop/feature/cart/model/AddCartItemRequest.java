package com.moeinantik.shop.feature.cart.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddCartItemRequest {

    @NotNull
    private Long productVariantId;

    @Positive
    private Integer quantity = 1;
}
