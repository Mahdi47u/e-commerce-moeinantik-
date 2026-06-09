package com.moeinantik.shop.feature.wishlist.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import com.moeinantik.shop.feature.product.repository.ProductRepository;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import com.moeinantik.shop.feature.wishlist.entity.WishlistItem;
import com.moeinantik.shop.feature.wishlist.mapper.WishlistMapper;
import com.moeinantik.shop.feature.wishlist.model.AddWishlistItemRequest;
import com.moeinantik.shop.feature.wishlist.model.WishlistItemResponse;
import com.moeinantik.shop.feature.wishlist.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WishlistMapper wishlistMapper;

    @Transactional(readOnly = true)
    public List<WishlistItemResponse> list(Authentication authentication) {
        return wishlistRepository.findAllByUserUsernameOrderByCreatedAtDesc(currentUser(authentication).getUsername())
                .stream().map(wishlistMapper::toResponse).toList();
    }

    @Transactional
    public WishlistItemResponse add(Authentication authentication, AddWishlistItemRequest request) {
        UserEntity user = currentUser(authentication);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found"));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("Product is not available");
        }

        WishlistItem existing = wishlistRepository.findByUserUsernameAndProductId(user.getUsername(), product.getId()).orElse(null);
        if (existing != null) {
            return wishlistMapper.toResponse(existing);
        }

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        return wishlistMapper.toResponse(wishlistRepository.save(item));
    }

    @Transactional
    public void remove(Authentication authentication, Long productId) {
        String username = currentUser(authentication).getUsername();
        WishlistItem item = wishlistRepository.findByUserUsernameAndProductId(username, productId)
                .orElseThrow(() -> new NotFoundException("Wishlist item not found"));
        wishlistRepository.delete(item);
    }

    private UserEntity currentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new NotFoundException("Current user not found");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new NotFoundException("Current user not found"));
    }
}
