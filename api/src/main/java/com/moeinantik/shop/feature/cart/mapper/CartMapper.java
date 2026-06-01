package com.moeinantik.shop.feature.cart.mapper;

import com.moeinantik.shop.feature.cart.entity.Cart;
import com.moeinantik.shop.feature.cart.entity.CartItem;
import com.moeinantik.shop.feature.cart.model.CartItemResponse;
import com.moeinantik.shop.feature.cart.model.CartResponse;
import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductGalleryImage;
import com.moeinantik.shop.feature.product.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Component
public class CartMapper {

    public CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::toItemResponse)
                .toList();

        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int itemCount = items.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();

        return new CartResponse(cart.getId(), items, itemCount, subtotal);
    }

    private CartItemResponse toItemResponse(CartItem item) {
        ProductVariant variant = item.getProductVariant();
        Product product = variant.getProduct();
        BigDecimal lineTotal = variant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return new CartItemResponse(
                item.getId(),
                product.getId(),
                product.getName(),
                product.getSlug(),
                variant.getId(),
                variant.getTitle(),
                variant.getSku(),
                variant.getPrice(),
                item.getQuantity(),
                lineTotal,
                primaryImageUrl(product)
        );
    }

    private String primaryImageUrl(Product product) {
        return product.getGalleryImages().stream()
                .min(Comparator.comparing((ProductGalleryImage image) -> !image.isPrimaryImage())
                        .thenComparing(ProductGalleryImage::getSortOrder))
                .map(image -> image.getMediaAsset().getUrl())
                .orElse(null);
    }
}
