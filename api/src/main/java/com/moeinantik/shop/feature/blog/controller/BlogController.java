package com.moeinantik.shop.feature.blog.controller;

import com.moeinantik.shop.feature.blog.model.BlogCategoryRequest;
import com.moeinantik.shop.feature.blog.model.BlogCategoryResponse;
import com.moeinantik.shop.feature.blog.model.BlogPostRequest;
import com.moeinantik.shop.feature.blog.model.BlogPostResponse;
import com.moeinantik.shop.feature.blog.service.BlogService;
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
public class BlogController {

    private final BlogService blogService;

    @PostMapping("/api/admin/blog/categories")
    public ResponseEntity<BlogCategoryResponse> createCategory(@Valid @RequestBody BlogCategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogService.createCategory(request));
    }

    @GetMapping("/api/admin/blog/categories")
    public ResponseEntity<List<BlogCategoryResponse>> listAdminCategories() {
        return ResponseEntity.ok(blogService.listAdminCategories());
    }

    @PutMapping("/api/admin/blog/categories/{id}")
    public ResponseEntity<BlogCategoryResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody BlogCategoryRequest request) {
        return ResponseEntity.ok(blogService.updateCategory(id, request));
    }

    @DeleteMapping("/api/admin/blog/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        blogService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/admin/blog/posts")
    public ResponseEntity<BlogPostResponse> createPost(@Valid @RequestBody BlogPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogService.createPost(request));
    }

    @GetMapping("/api/admin/blog/posts")
    public ResponseEntity<List<BlogPostResponse>> listAdminPosts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(blogService.listAdminPosts(page, size));
    }

    @GetMapping("/api/admin/blog/posts/{id}")
    public ResponseEntity<BlogPostResponse> getAdminPost(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getAdminPost(id));
    }

    @PutMapping("/api/admin/blog/posts/{id}")
    public ResponseEntity<BlogPostResponse> updatePost(@PathVariable Long id, @Valid @RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(blogService.updatePost(id, request));
    }

    @DeleteMapping("/api/admin/blog/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/blog/categories")
    public ResponseEntity<List<BlogCategoryResponse>> listPublicCategories() {
        return ResponseEntity.ok(blogService.listPublicCategories());
    }

    @GetMapping("/api/blog/posts")
    public ResponseEntity<List<BlogPostResponse>> listPublicPosts(
            @RequestParam(value = "category", required = false) String categorySlug,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(blogService.listPublicPosts(categorySlug, query, page, size));
    }

    @GetMapping("/api/blog/posts/{slug}")
    public ResponseEntity<BlogPostResponse> getPublicPost(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getPublicPost(slug));
    }
}
