package com.moeinantik.shop.feature.media.controller;

import com.moeinantik.shop.feature.media.model.MediaAssetResponse;
import com.moeinantik.shop.feature.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(value = "/api/admin/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaAssetResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mediaService.upload(file, altText));
    }

    @GetMapping("/api/admin/media")
    public ResponseEntity<List<MediaAssetResponse>> list() {
        return ResponseEntity.ok(mediaService.list());
    }

    @GetMapping("/api/media/{id}")
    public ResponseEntity<MediaAssetResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(mediaService.get(id));
    }

    @DeleteMapping("/api/admin/media/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mediaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
