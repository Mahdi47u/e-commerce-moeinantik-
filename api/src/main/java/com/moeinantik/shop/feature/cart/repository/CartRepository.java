package com.moeinantik.shop.feature.cart.repository;

import com.moeinantik.shop.feature.cart.entity.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @EntityGraph(attributePaths = {
            "items",
            "items.productVariant",
            "items.productVariant.product",
            "items.productVariant.product.galleryImages",
            "items.productVariant.product.galleryImages.mediaAsset"
    })
    Optional<Cart> findByUserUsername(String username);
}
