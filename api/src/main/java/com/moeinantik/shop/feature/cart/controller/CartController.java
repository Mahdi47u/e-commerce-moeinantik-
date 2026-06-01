package com.moeinantik.shop.feature.cart.controller;

import com.moeinantik.shop.feature.cart.model.AddCartItemRequest;
import com.moeinantik.shop.feature.cart.model.CartResponse;
import com.moeinantik.shop.feature.cart.model.UpdateCartItemRequest;
import com.moeinantik.shop.feature.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> get(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            Authentication authentication,
            @Valid @RequestBody AddCartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.addItem(authentication, request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateItem(
            Authentication authentication,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.updateItem(authentication, itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(Authentication authentication, @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(authentication, itemId));
    }

    @DeleteMapping
    public ResponseEntity<CartResponse> clear(Authentication authentication) {
        return ResponseEntity.ok(cartService.clear(authentication));
    }
}
