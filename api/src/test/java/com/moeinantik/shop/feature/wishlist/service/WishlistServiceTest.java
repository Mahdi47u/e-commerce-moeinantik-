package com.moeinantik.shop.feature.wishlist.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import com.moeinantik.shop.feature.product.mapper.ProductMapper;
import com.moeinantik.shop.feature.product.repository.ProductRepository;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import com.moeinantik.shop.feature.wishlist.mapper.WishlistMapper;
import com.moeinantik.shop.feature.wishlist.model.AddWishlistItemRequest;
import com.moeinantik.shop.feature.wishlist.repository.WishlistItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class WishlistServiceTest {

    private final WishlistItemRepository wishlistRepository = mock(WishlistItemRepository.class);
    private final ProductRepository productRepository = mock(ProductRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final WishlistService wishlistService = new WishlistService(
            wishlistRepository,
            productRepository,
            userRepository,
            new WishlistMapper(new ProductMapper())
    );

    @Test
    void addRejectsInactiveProduct() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("buyer");

        UserEntity user = new UserEntity();
        user.setUsername("buyer");
        when(userRepository.findByUsername("buyer")).thenReturn(Optional.of(user));

        Product product = new Product();
        product.setStatus(ProductStatus.DRAFT);
        when(productRepository.findById(9L)).thenReturn(Optional.of(product));

        AddWishlistItemRequest request = new AddWishlistItemRequest();
        request.setProductId(9L);

        assertThatThrownBy(() -> wishlistService.add(authentication, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Product is not available");
    }
}
