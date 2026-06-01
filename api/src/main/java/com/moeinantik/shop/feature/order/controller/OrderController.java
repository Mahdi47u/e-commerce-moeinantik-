package com.moeinantik.shop.feature.order.controller;

import com.moeinantik.shop.feature.order.model.OrderResponse;
import com.moeinantik.shop.feature.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/api/orders")
    public ResponseEntity<List<OrderResponse>> listMine(Authentication authentication) {
        return ResponseEntity.ok(orderService.listMine(authentication));
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<OrderResponse> getMine(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getMine(authentication, id));
    }

    @GetMapping("/api/admin/orders")
    public ResponseEntity<List<OrderResponse>> listAdmin() {
        return ResponseEntity.ok(orderService.listAdmin());
    }
}
