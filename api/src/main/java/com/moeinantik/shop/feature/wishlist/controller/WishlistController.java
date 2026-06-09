package com.moeinantik.shop.feature.wishlist.controller;

import com.moeinantik.shop.feature.wishlist.model.AddWishlistItemRequest;
import com.moeinantik.shop.feature.wishlist.model.WishlistItemResponse;
import com.moeinantik.shop.feature.wishlist.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItemResponse>> list(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.list(authentication));
    }

    @PostMapping
    public ResponseEntity<WishlistItemResponse> add(
            Authentication authentication,
            @Valid @RequestBody AddWishlistItemRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(wishlistService.add(authentication, request));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> remove(Authentication authentication, @PathVariable Long productId) {
        wishlistService.remove(authentication, productId);
        return ResponseEntity.noContent().build();
    }
}
