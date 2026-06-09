package com.moeinantik.shop.feature.page.controller;

import com.moeinantik.shop.feature.page.model.ContentPageRequest;
import com.moeinantik.shop.feature.page.model.ContentPageResponse;
import com.moeinantik.shop.feature.page.service.ContentPageService;
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
public class ContentPageController {

    private final ContentPageService pageService;

    @PostMapping("/api/admin/pages")
    public ResponseEntity<ContentPageResponse> create(@Valid @RequestBody ContentPageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pageService.create(request));
    }

    @GetMapping("/api/admin/pages")
    public ResponseEntity<List<ContentPageResponse>> listAdmin(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(pageService.listAdmin(page, size));
    }

    @PutMapping("/api/admin/pages/{id}")
    public ResponseEntity<ContentPageResponse> update(@PathVariable Long id, @Valid @RequestBody ContentPageRequest request) {
        return ResponseEntity.ok(pageService.update(id, request));
    }

    @DeleteMapping("/api/admin/pages/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pageService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/pages/{slug}")
    public ResponseEntity<ContentPageResponse> getPublic(@PathVariable String slug) {
        return ResponseEntity.ok(pageService.getPublic(slug));
    }
}
