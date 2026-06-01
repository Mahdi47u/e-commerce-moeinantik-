package com.moeinantik.shop.feature.order.controller;

import com.moeinantik.shop.feature.order.model.CheckoutRequest;
import com.moeinantik.shop.feature.order.model.OrderResponse;
import com.moeinantik.shop.feature.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> checkout(
            Authentication authentication,
            @Valid @RequestBody CheckoutRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.checkout(authentication, request));
    }
}
