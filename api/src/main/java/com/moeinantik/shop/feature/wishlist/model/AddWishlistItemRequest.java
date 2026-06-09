package com.moeinantik.shop.feature.wishlist.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddWishlistItemRequest {

    @NotNull
    private Long productId;
}
