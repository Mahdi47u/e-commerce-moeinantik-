package com.moeinantik.shop.feature.attribute.controller;

import com.moeinantik.shop.feature.attribute.model.AttributeRequest;
import com.moeinantik.shop.feature.attribute.model.AttributeResponse;
import com.moeinantik.shop.feature.attribute.model.AttributeValueRequest;
import com.moeinantik.shop.feature.attribute.model.AttributeValueResponse;
import com.moeinantik.shop.feature.attribute.service.AttributeService;
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
public class AttributeController {

    private final AttributeService attributeService;

    @PostMapping("/api/admin/attributes")
    public ResponseEntity<AttributeResponse> create(@Valid @RequestBody AttributeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attributeService.create(request));
    }

    @GetMapping("/api/admin/attributes")
    public ResponseEntity<List<AttributeResponse>> listAdmin() {
        return ResponseEntity.ok(attributeService.listAdmin());
    }

    @GetMapping("/api/admin/attributes/{id}")
    public ResponseEntity<AttributeResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(attributeService.get(id));
    }

    @PutMapping("/api/admin/attributes/{id}")
    public ResponseEntity<AttributeResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AttributeRequest request
    ) {
        return ResponseEntity.ok(attributeService.update(id, request));
    }

    @DeleteMapping("/api/admin/attributes/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        attributeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/admin/attributes/{attributeId}/values")
    public ResponseEntity<AttributeValueResponse> createValue(
            @PathVariable Long attributeId,
            @Valid @RequestBody AttributeValueRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attributeService.createValue(attributeId, request));
    }

    @PutMapping("/api/admin/attributes/{attributeId}/values/{valueId}")
    public ResponseEntity<AttributeValueResponse> updateValue(
            @PathVariable Long attributeId,
            @PathVariable Long valueId,
            @Valid @RequestBody AttributeValueRequest request
    ) {
        return ResponseEntity.ok(attributeService.updateValue(attributeId, valueId, request));
    }

    @DeleteMapping("/api/admin/attributes/{attributeId}/values/{valueId}")
    public ResponseEntity<Void> deleteValue(
            @PathVariable Long attributeId,
            @PathVariable Long valueId
    ) {
        attributeService.deleteValue(attributeId, valueId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/attributes")
    public ResponseEntity<List<AttributeResponse>> listPublic() {
        return ResponseEntity.ok(attributeService.listPublic());
    }
}
