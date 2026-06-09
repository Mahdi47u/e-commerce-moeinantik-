package com.moeinantik.shop.feature.homepage.controller;

import com.moeinantik.shop.feature.homepage.model.HomepageResponse;
import com.moeinantik.shop.feature.homepage.model.HomepageSectionRequest;
import com.moeinantik.shop.feature.homepage.model.HomepageSectionResponse;
import com.moeinantik.shop.feature.homepage.service.HomepageService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HomepageController {

    private final HomepageService homepageService;

    @GetMapping("/api/homepage")
    public ResponseEntity<HomepageResponse> getPublic() {
        return ResponseEntity.ok(homepageService.getPublic());
    }

    @PostMapping("/api/admin/homepage/sections")
    public ResponseEntity<HomepageSectionResponse> create(@Valid @RequestBody HomepageSectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(homepageService.create(request));
    }

    @GetMapping("/api/admin/homepage/sections")
    public ResponseEntity<List<HomepageSectionResponse>> listAdmin() {
        return ResponseEntity.ok(homepageService.listAdmin());
    }

    @PutMapping("/api/admin/homepage/sections/{id}")
    public ResponseEntity<HomepageSectionResponse> update(@PathVariable Long id, @Valid @RequestBody HomepageSectionRequest request) {
        return ResponseEntity.ok(homepageService.update(id, request));
    }

    @DeleteMapping("/api/admin/homepage/sections/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        homepageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
