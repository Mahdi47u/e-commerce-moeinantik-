package com.moeinantik.shop.feature.wishlist.repository;

import com.moeinantik.shop.feature.wishlist.entity.WishlistItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    @EntityGraph(attributePaths = {
            "product",
            "product.category",
            "product.variants",
            "product.galleryImages",
            "product.galleryImages.mediaAsset",
            "product.attributeAssignments",
            "product.attributeAssignments.attribute",
            "product.attributeAssignments.attributeValue"
    })
    List<WishlistItem> findAllByUserUsernameOrderByCreatedAtDesc(String username);

    Optional<WishlistItem> findByUserUsernameAndProductId(String username, Long productId);

    boolean existsByUserUsernameAndProductId(String username, Long productId);
}
