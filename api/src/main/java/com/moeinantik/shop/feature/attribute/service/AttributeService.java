package com.moeinantik.shop.feature.attribute.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.common.util.SlugUtil;
import com.moeinantik.shop.feature.attribute.entity.AttributeType;
import com.moeinantik.shop.feature.attribute.entity.ProductAttribute;
import com.moeinantik.shop.feature.attribute.entity.ProductAttributeValue;
import com.moeinantik.shop.feature.attribute.mapper.AttributeMapper;
import com.moeinantik.shop.feature.attribute.model.AttributeRequest;
import com.moeinantik.shop.feature.attribute.model.AttributeResponse;
import com.moeinantik.shop.feature.attribute.model.AttributeValueRequest;
import com.moeinantik.shop.feature.attribute.model.AttributeValueResponse;
import com.moeinantik.shop.feature.attribute.repository.ProductAttributeRepository;
import com.moeinantik.shop.feature.attribute.repository.ProductAttributeValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttributeService {

    private final ProductAttributeRepository attributeRepository;
    private final ProductAttributeValueRepository valueRepository;
    private final AttributeMapper attributeMapper;

    @Transactional
    public AttributeResponse create(AttributeRequest request) {
        ProductAttribute attribute = new ProductAttribute();
        applyAttributeRequest(attribute, request);
        validateUniqueAttributeSlug(attribute.getSlug(), null);

        return attributeMapper.toResponse(attributeRepository.save(attribute));
    }

    @Transactional(readOnly = true)
    public List<AttributeResponse> listAdmin() {
        return attributeRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(attributeMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AttributeResponse> listPublic() {
        return attributeRepository.findAllByActiveTrueOrderBySortOrderAscNameAsc().stream()
                .map(attribute -> attributeMapper.toResponse(attribute, true))
                .toList();
    }

    @Transactional(readOnly = true)
    public AttributeResponse get(Long id) {
        return attributeMapper.toResponse(findAttribute(id));
    }

    @Transactional
    public AttributeResponse update(Long id, AttributeRequest request) {
        ProductAttribute attribute = findAttribute(id);
        applyAttributeRequest(attribute, request);
        validateUniqueAttributeSlug(attribute.getSlug(), id);

        return attributeMapper.toResponse(attribute);
    }

    @Transactional
    public void delete(Long id) {
        attributeRepository.delete(findAttribute(id));
    }

    @Transactional
    public AttributeValueResponse createValue(Long attributeId, AttributeValueRequest request) {
        ProductAttribute attribute = findAttribute(attributeId);
        ensureAttributeSupportsValues(attribute);

        ProductAttributeValue value = new ProductAttributeValue();
        value.setAttribute(attribute);
        applyValueRequest(value, request);
        validateUniqueValueSlug(attributeId, value.getSlug(), null);

        attribute.getValues().add(value);
        return attributeMapper.toValueResponse(valueRepository.save(value));
    }

    @Transactional
    public AttributeValueResponse updateValue(Long attributeId, Long valueId, AttributeValueRequest request) {
        ProductAttribute attribute = findAttribute(attributeId);
        ProductAttributeValue value = findValue(valueId);

        if (!value.getAttribute().getId().equals(attribute.getId())) {
            throw new NotFoundException("Attribute value not found");
        }

        applyValueRequest(value, request);
        validateUniqueValueSlug(attributeId, value.getSlug(), valueId);

        return attributeMapper.toValueResponse(value);
    }

    @Transactional
    public void deleteValue(Long attributeId, Long valueId) {
        ProductAttributeValue value = findValue(valueId);

        if (!value.getAttribute().getId().equals(attributeId)) {
            throw new NotFoundException("Attribute value not found");
        }

        valueRepository.delete(value);
    }

    private void applyAttributeRequest(ProductAttribute attribute, AttributeRequest request) {
        attribute.setName(request.getName().trim());
        attribute.setSlug(resolveSlug(request.getSlug(), request.getName(), "Attribute slug is required"));
        attribute.setType(request.getType());
        attribute.setFilterable(request.getFilterable() == null || request.getFilterable());
        attribute.setActive(request.getActive() == null || request.getActive());
        attribute.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
    }

    private void applyValueRequest(ProductAttributeValue value, AttributeValueRequest request) {
        value.setValue(request.getValue().trim());
        value.setSlug(resolveSlug(request.getSlug(), request.getValue(), "Attribute value slug is required"));
        value.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        value.setActive(request.getActive() == null || request.getActive());
    }

    private void ensureAttributeSupportsValues(ProductAttribute attribute) {
        if (attribute.getType() != AttributeType.SELECT && attribute.getType() != AttributeType.MULTI_SELECT) {
            throw new BadRequestException("Only SELECT and MULTI_SELECT attributes can have predefined values");
        }
    }

    private String resolveSlug(String requestedSlug, String fallback, String errorMessage) {
        String slug = SlugUtil.from(requestedSlug == null || requestedSlug.isBlank() ? fallback : requestedSlug);

        if (slug.isBlank()) {
            throw new BadRequestException(errorMessage);
        }

        return slug;
    }

    private void validateUniqueAttributeSlug(String slug, Long currentId) {
        boolean exists = currentId == null
                ? attributeRepository.existsBySlug(slug)
                : attributeRepository.existsBySlugAndIdNot(slug, currentId);

        if (exists) {
            throw new BadRequestException("Attribute slug is already used");
        }
    }

    private void validateUniqueValueSlug(Long attributeId, String slug, Long currentId) {
        boolean exists = currentId == null
                ? valueRepository.existsByAttributeIdAndSlug(attributeId, slug)
                : valueRepository.existsByAttributeIdAndSlugAndIdNot(attributeId, slug, currentId);

        if (exists) {
            throw new BadRequestException("Attribute value slug is already used");
        }
    }

    private ProductAttribute findAttribute(Long id) {
        return attributeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attribute not found"));
    }

    private ProductAttributeValue findValue(Long id) {
        return valueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attribute value not found"));
    }
}
