package com.moeinantik.shop.feature.order.controller;

import com.moeinantik.shop.feature.order.model.OrderResponse;
import com.moeinantik.shop.feature.order.model.UpdateOrderStatusRequest;
import com.moeinantik.shop.feature.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/api/orders")
    public ResponseEntity<List<OrderResponse>> listMine(
            Authentication authentication,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "30") int size
    ) {
        return ResponseEntity.ok(orderService.listMine(authentication, page, size));
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<OrderResponse> getMine(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getMine(authentication, id));
    }

    @GetMapping("/api/admin/orders")
    public ResponseEntity<List<OrderResponse>> listAdmin(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(orderService.listAdmin(page, size));
    }

    @GetMapping("/api/admin/orders/{id}")
    public ResponseEntity<OrderResponse> getAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getAdmin(id));
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }
}
