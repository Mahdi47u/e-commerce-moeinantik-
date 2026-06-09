package com.moeinantik.shop.feature.cart.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.feature.cart.entity.Cart;
import com.moeinantik.shop.feature.cart.mapper.CartMapper;
import com.moeinantik.shop.feature.cart.model.AddCartItemRequest;
import com.moeinantik.shop.feature.cart.repository.CartRepository;
import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import com.moeinantik.shop.feature.product.entity.ProductVariant;
import com.moeinantik.shop.feature.product.repository.ProductVariantRepository;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CartServiceTest {

    private final CartRepository cartRepository = mock(CartRepository.class);
    private final ProductVariantRepository variantRepository = mock(ProductVariantRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final CartService cartService = new CartService(cartRepository, variantRepository, userRepository, new CartMapper());

    @Test
    void addItemRejectsQuantityAboveStock() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("buyer");

        UserEntity user = new UserEntity();
        user.setUsername("buyer");
        when(userRepository.findByUsername("buyer")).thenReturn(Optional.of(user));

        Cart cart = new Cart();
        cart.setUser(user);
        when(cartRepository.findByUserUsername("buyer")).thenReturn(Optional.of(cart));

        Product product = new Product();
        product.setStatus(ProductStatus.ACTIVE);

        ProductVariant variant = new ProductVariant();
        variant.setId(5L);
        variant.setProduct(product);
        variant.setPrice(BigDecimal.TEN);
        variant.setStockQuantity(1);
        variant.setActive(true);
        when(variantRepository.findById(5L)).thenReturn(Optional.of(variant));

        AddCartItemRequest request = new AddCartItemRequest();
        request.setProductVariantId(5L);
        request.setQuantity(2);

        assertThatThrownBy(() -> cartService.addItem(authentication, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Requested quantity is not available");
    }
}
