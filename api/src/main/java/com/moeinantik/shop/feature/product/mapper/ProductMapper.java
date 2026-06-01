package com.moeinantik.shop.feature.product.mapper;

import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductAttributeAssignment;
import com.moeinantik.shop.feature.product.entity.ProductGalleryImage;
import com.moeinantik.shop.feature.product.entity.ProductVariant;
import com.moeinantik.shop.feature.product.model.ProductAttributeAssignmentResponse;
import com.moeinantik.shop.feature.product.model.ProductGalleryImageResponse;
import com.moeinantik.shop.feature.product.model.ProductResponse;
import com.moeinantik.shop.feature.product.model.ProductVariantResponse;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        return toResponse(product, false);
    }

    public ProductResponse toResponse(Product product, boolean publicView) {
        return new ProductResponse(
                product.getId(),
                product.getCreatedAt(),
                product.getName(),
                product.getSlug(),
                product.getSku(),
                product.getShortDescription(),
                product.getDescription(),
                product.getCategory() == null ? null : product.getCategory().getId(),
                product.getCategory() == null ? null : product.getCategory().getName(),
                product.getStatus(),
                product.isFeatured(),
                product.getSortOrder(),
                product.getSeoTitle(),
                product.getSeoDescription(),
                product.getVariants().stream()
                        .filter(variant -> !publicView || variant.isActive())
                        .map(this::toVariantResponse)
                        .toList(),
                product.getGalleryImages().stream().map(this::toGalleryImageResponse).toList(),
                product.getAttributeAssignments().stream()
                        .filter(assignment -> !publicView || assignment.getAttribute().isActive())
                        .filter(assignment -> !publicView
                                || assignment.getAttributeValue() == null
                                || assignment.getAttributeValue().isActive())
                        .map(this::toAttributeResponse)
                        .toList()
        );
    }

    private ProductVariantResponse toVariantResponse(ProductVariant variant) {
        return new ProductVariantResponse(
                variant.getId(),
                variant.getTitle(),
                variant.getSku(),
                variant.getPrice(),
                variant.getCompareAtPrice(),
                variant.getStockQuantity(),
                variant.isActive(),
                variant.getSortOrder()
        );
    }

    private ProductGalleryImageResponse toGalleryImageResponse(ProductGalleryImage image) {
        return new ProductGalleryImageResponse(
                image.getId(),
                image.getMediaAsset().getId(),
                image.getMediaAsset().getUrl(),
                image.getAltText() == null ? image.getMediaAsset().getAltText() : image.getAltText(),
                image.isPrimaryImage(),
                image.getSortOrder(),
                image.getMediaAsset().getWidth(),
                image.getMediaAsset().getHeight()
        );
    }

    private ProductAttributeAssignmentResponse toAttributeResponse(ProductAttributeAssignment assignment) {
        return new ProductAttributeAssignmentResponse(
                assignment.getId(),
                assignment.getAttribute().getId(),
                assignment.getAttribute().getName(),
                assignment.getAttribute().getSlug(),
                assignment.getAttributeValue() == null ? null : assignment.getAttributeValue().getId(),
                assignment.getAttributeValue() == null ? null : assignment.getAttributeValue().getValue(),
                assignment.getValueText(),
                assignment.getValueNumber(),
                assignment.getValueBoolean(),
                assignment.getSortOrder()
        );
    }
}
