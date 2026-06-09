package com.moeinantik.shop.feature.product.controller;

import com.moeinantik.shop.feature.product.model.ProductRequest;
import com.moeinantik.shop.feature.product.model.ProductResponse;
import com.moeinantik.shop.feature.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/api/admin/products")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    @GetMapping("/api/admin/products")
    public ResponseEntity<List<ProductResponse>> listAdmin(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "30") int size
    ) {
        return ResponseEntity.ok(productService.listAdmin(page, size));
    }

    @GetMapping("/api/admin/products/{id}")
    public ResponseEntity<ProductResponse> getAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getAdmin(id));
    }

    @PutMapping("/api/admin/products/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/api/admin/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/products")
    public ResponseEntity<List<ProductResponse>> listPublic(
            @RequestParam(value = "category", required = false) String categorySlug,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "24") int size
    ) {
        return ResponseEntity.ok(productService.listPublic(categorySlug, page, size));
    }

    @GetMapping("/api/products/{slug}")
    public ResponseEntity<ProductResponse> getPublicBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getPublicBySlug(slug));
    }
}
