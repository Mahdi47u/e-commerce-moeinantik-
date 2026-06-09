package com.moeinantik.shop.feature.order.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.feature.cart.entity.Cart;
import com.moeinantik.shop.feature.cart.repository.CartRepository;
import com.moeinantik.shop.feature.order.mapper.OrderMapper;
import com.moeinantik.shop.feature.order.model.CheckoutRequest;
import com.moeinantik.shop.feature.order.repository.OrderRepository;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class OrderServiceTest {

    private final OrderRepository orderRepository = mock(OrderRepository.class);
    private final CartRepository cartRepository = mock(CartRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final OrderService orderService = new OrderService(
            orderRepository,
            cartRepository,
            userRepository,
            new OrderMapper()
    );

    @Test
    void checkoutRejectsEmptyCart() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("buyer");

        UserEntity user = new UserEntity();
        user.setUsername("buyer");
        when(userRepository.findByUsername("buyer")).thenReturn(Optional.of(user));

        Cart cart = new Cart();
        cart.setUser(user);
        when(cartRepository.findByUserUsername("buyer")).thenReturn(Optional.of(cart));

        CheckoutRequest request = new CheckoutRequest();
        request.setCustomerName("Buyer");
        request.setCustomerPhone("09120000000");
        request.setProvince("Tehran");
        request.setCity("Tehran");
        request.setAddressLine("Address");

        assertThatThrownBy(() -> orderService.checkout(authentication, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Cart is empty");
    }
}
