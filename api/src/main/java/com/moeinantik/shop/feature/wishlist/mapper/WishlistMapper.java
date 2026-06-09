package com.moeinantik.shop.feature.wishlist.mapper;

import com.moeinantik.shop.feature.product.mapper.ProductMapper;
import com.moeinantik.shop.feature.wishlist.entity.WishlistItem;
import com.moeinantik.shop.feature.wishlist.model.WishlistItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WishlistMapper {

    private final ProductMapper productMapper;

    public WishlistItemResponse toResponse(WishlistItem item) {
        return new WishlistItemResponse(
                item.getId(),
                item.getCreatedAt(),
                productMapper.toResponse(item.getProduct(), true)
        );
    }
}
