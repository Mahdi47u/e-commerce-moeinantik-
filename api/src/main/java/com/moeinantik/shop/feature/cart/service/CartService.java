package com.moeinantik.shop.feature.cart.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.feature.cart.entity.Cart;
import com.moeinantik.shop.feature.cart.entity.CartItem;
import com.moeinantik.shop.feature.cart.mapper.CartMapper;
import com.moeinantik.shop.feature.cart.model.AddCartItemRequest;
import com.moeinantik.shop.feature.cart.model.CartResponse;
import com.moeinantik.shop.feature.cart.model.UpdateCartItemRequest;
import com.moeinantik.shop.feature.cart.repository.CartRepository;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import com.moeinantik.shop.feature.product.entity.ProductVariant;
import com.moeinantik.shop.feature.product.repository.ProductVariantRepository;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Transactional
    public CartResponse getCart(Authentication authentication) {
        return cartMapper.toResponse(getOrCreateCart(authentication));
    }

    @Transactional
    public CartResponse addItem(Authentication authentication, AddCartItemRequest request) {
        Cart cart = getOrCreateCart(authentication);
        ProductVariant variant = findPurchasableVariant(request.getProductVariantId());
        int quantityToAdd = request.getQuantity() == null ? 1 : request.getQuantity();

        CartItem item = cart.getItems().stream()
                .filter(existing -> existing.getProductVariant().getId().equals(variant.getId()))
                .findFirst()
                .orElseGet(() -> {
                    CartItem nextItem = new CartItem();
                    nextItem.setCart(cart);
                    nextItem.setProductVariant(variant);
                    nextItem.setQuantity(0);
                    cart.getItems().add(nextItem);
                    return nextItem;
                });

        int nextQuantity = item.getQuantity() + quantityToAdd;
        validateStock(variant, nextQuantity);
        item.setQuantity(nextQuantity);

        return cartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse updateItem(Authentication authentication, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(authentication);
        CartItem item = findItem(cart, itemId);
        validateStock(item.getProductVariant(), request.getQuantity());
        item.setQuantity(request.getQuantity());

        return cartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(Authentication authentication, Long itemId) {
        Cart cart = getOrCreateCart(authentication);
        CartItem item = findItem(cart, itemId);
        cart.getItems().remove(item);

        return cartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse clear(Authentication authentication) {
        Cart cart = getOrCreateCart(authentication);
        cart.getItems().clear();

        return cartMapper.toResponse(cart);
    }

    private Cart getOrCreateCart(Authentication authentication) {
        UserEntity user = currentUser(authentication);

        return cartRepository.findByUserUsername(user.getUsername())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    private UserEntity currentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new NotFoundException("Current user not found");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new NotFoundException("Current user not found"));
    }

    private ProductVariant findPurchasableVariant(Long variantId) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new NotFoundException("Product variant not found"));

        if (!variant.isActive() || variant.getProduct().getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("Product variant is not available");
        }

        return variant;
    }

    private CartItem findItem(Cart cart, Long itemId) {
        return cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Cart item not found"));
    }

    private void validateStock(ProductVariant variant, int quantity) {
        if (quantity > variant.getStockQuantity()) {
            throw new BadRequestException("Requested quantity is not available");
        }
    }
}
