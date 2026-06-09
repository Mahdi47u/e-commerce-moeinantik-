package com.moeinantik.shop.feature.product.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.common.util.SlugUtil;
import com.moeinantik.shop.feature.attribute.entity.AttributeType;
import com.moeinantik.shop.feature.attribute.entity.ProductAttribute;
import com.moeinantik.shop.feature.attribute.entity.ProductAttributeValue;
import com.moeinantik.shop.feature.attribute.repository.ProductAttributeRepository;
import com.moeinantik.shop.feature.attribute.repository.ProductAttributeValueRepository;
import com.moeinantik.shop.feature.category.entity.Category;
import com.moeinantik.shop.feature.category.repository.CategoryRepository;
import com.moeinantik.shop.feature.media.entity.MediaAsset;
import com.moeinantik.shop.feature.media.repository.MediaAssetRepository;
import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductAttributeAssignment;
import com.moeinantik.shop.feature.product.entity.ProductGalleryImage;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import com.moeinantik.shop.feature.product.entity.ProductVariant;
import com.moeinantik.shop.feature.product.mapper.ProductMapper;
import com.moeinantik.shop.feature.product.model.ProductAttributeAssignmentRequest;
import com.moeinantik.shop.feature.product.model.ProductGalleryImageRequest;
import com.moeinantik.shop.feature.product.model.ProductRequest;
import com.moeinantik.shop.feature.product.model.ProductResponse;
import com.moeinantik.shop.feature.product.model.ProductVariantRequest;
import com.moeinantik.shop.feature.product.repository.ProductRepository;
import com.moeinantik.shop.feature.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final CategoryRepository categoryRepository;
    private final MediaAssetRepository mediaAssetRepository;
    private final ProductAttributeRepository attributeRepository;
    private final ProductAttributeValueRepository attributeValueRepository;
    private final ProductMapper productMapper;

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        validateUniqueProduct(product, null);

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listAdmin(int page, int size) {
        return productRepository.findAllByOrderBySortOrderAscCreatedAtDesc(pageable(page, size)).stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listPublic(String categorySlug, int page, int size) {
        List<Product> products = categorySlug == null || categorySlug.isBlank()
                ? productRepository.findAllByStatusOrderBySortOrderAscCreatedAtDesc(ProductStatus.ACTIVE, pageable(page, size))
                : productRepository.findAllByCategorySlugAndStatusOrderBySortOrderAscCreatedAtDesc(
                        categorySlug,
                        ProductStatus.ACTIVE,
                        pageable(page, size)
                );

        return products.stream()
                .map(product -> productMapper.toResponse(product, true))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getAdmin(Long id) {
        return productMapper.toResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public ProductResponse getPublicBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new NotFoundException("Product not found");
        }

        return productMapper.toResponse(product, true);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findById(id);
        applyRequest(product, request);
        validateUniqueProduct(product, id);

        return productMapper.toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        productRepository.delete(findById(id));
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setName(request.getName().trim());
        product.setSlug(resolveSlug(request.getSlug(), request.getName()));
        product.setSku(blankToNull(request.getSku()));
        product.setShortDescription(blankToNull(request.getShortDescription()));
        product.setDescription(blankToNull(request.getDescription()));
        product.setCategory(resolveCategory(request.getCategoryId()));
        product.setStatus(request.getStatus() == null ? ProductStatus.DRAFT : request.getStatus());
        product.setFeatured(Boolean.TRUE.equals(request.getFeatured()));
        product.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        product.setSeoTitle(blankToNull(request.getSeoTitle()));
        product.setSeoDescription(blankToNull(request.getSeoDescription()));

        replaceVariants(product, request.getVariants());
        replaceGalleryImages(product, request.getGalleryImages());
        replaceAttributeAssignments(product, request.getAttributes());
    }

    private void replaceVariants(Product product, List<ProductVariantRequest> requests) {
        product.getVariants().clear();

        for (ProductVariantRequest request : safeList(requests)) {
            ProductVariant variant = new ProductVariant();
            variant.setProduct(product);
            variant.setTitle(request.getTitle().trim());
            variant.setSku(blankToNull(request.getSku()));
            variant.setPrice(request.getPrice());
            variant.setCompareAtPrice(request.getCompareAtPrice());
            variant.setStockQuantity(request.getStockQuantity() == null ? 0 : request.getStockQuantity());
            variant.setActive(request.getActive() == null || request.getActive());
            variant.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
            product.getVariants().add(variant);
        }
    }

    private void replaceGalleryImages(Product product, List<ProductGalleryImageRequest> requests) {
        product.getGalleryImages().clear();
        Set<Long> usedMediaAssetIds = new HashSet<>();
        boolean primarySeen = false;

        for (ProductGalleryImageRequest request : safeList(requests)) {
            if (!usedMediaAssetIds.add(request.getMediaAssetId())) {
                throw new BadRequestException("Product gallery contains duplicate media assets");
            }

            ProductGalleryImage image = new ProductGalleryImage();
            image.setProduct(product);
            image.setMediaAsset(findMediaAsset(request.getMediaAssetId()));
            image.setAltText(blankToNull(request.getAltText()));
            image.setPrimaryImage(Boolean.TRUE.equals(request.getPrimaryImage()) && !primarySeen);
            image.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
            primarySeen = primarySeen || image.isPrimaryImage();
            product.getGalleryImages().add(image);
        }

        if (!primarySeen && !product.getGalleryImages().isEmpty()) {
            product.getGalleryImages().get(0).setPrimaryImage(true);
        }
    }

    private void replaceAttributeAssignments(Product product, List<ProductAttributeAssignmentRequest> requests) {
        product.getAttributeAssignments().clear();

        for (ProductAttributeAssignmentRequest request : safeList(requests)) {
            ProductAttribute attribute = findAttribute(request.getAttributeId());
            ProductAttributeAssignment assignment = new ProductAttributeAssignment();
            assignment.setProduct(product);
            assignment.setAttribute(attribute);
            assignment.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
            applyAttributeValue(assignment, attribute, request);
            product.getAttributeAssignments().add(assignment);
        }
    }

    private void applyAttributeValue(
            ProductAttributeAssignment assignment,
            ProductAttribute attribute,
            ProductAttributeAssignmentRequest request
    ) {
        AttributeType type = attribute.getType();

        if (type == AttributeType.SELECT || type == AttributeType.MULTI_SELECT) {
            if (request.getAttributeValueId() == null) {
                throw new BadRequestException("Attribute value is required for select attributes");
            }

            ProductAttributeValue value = findAttributeValue(request.getAttributeValueId());
            if (!value.getAttribute().getId().equals(attribute.getId())) {
                throw new BadRequestException("Attribute value does not belong to the selected attribute");
            }

            assignment.setAttributeValue(value);
            return;
        }

        if (type == AttributeType.NUMBER) {
            if (request.getValueNumber() == null) {
                throw new BadRequestException("Number value is required for number attributes");
            }
            assignment.setValueNumber(request.getValueNumber());
            return;
        }

        if (type == AttributeType.BOOLEAN) {
            if (request.getValueBoolean() == null) {
                throw new BadRequestException("Boolean value is required for boolean attributes");
            }
            assignment.setValueBoolean(request.getValueBoolean());
            return;
        }

        String text = blankToNull(request.getValueText());
        if (text == null) {
            throw new BadRequestException("Text value is required for text attributes");
        }
        assignment.setValueText(text);
    }

    private void validateUniqueProduct(Product product, Long currentId) {
        boolean slugExists = currentId == null
                ? productRepository.existsBySlug(product.getSlug())
                : productRepository.existsBySlugAndIdNot(product.getSlug(), currentId);

        if (slugExists) {
            throw new BadRequestException("Product slug is already used");
        }

        if (product.getSku() == null) {
            return;
        }

        boolean skuExists = currentId == null
                ? productRepository.existsBySku(product.getSku())
                : productRepository.existsBySkuAndIdNot(product.getSku(), currentId);

        if (skuExists) {
            throw new BadRequestException("Product SKU is already used");
        }

        Set<String> variantSkus = new HashSet<>();
        for (ProductVariant variant : product.getVariants()) {
            if (variant.getSku() == null) {
                continue;
            }

            if (!variantSkus.add(variant.getSku())) {
                throw new BadRequestException("Product contains duplicate variant SKUs");
            }

            boolean variantSkuExists = currentId == null
                    ? variantRepository.existsBySku(variant.getSku())
                    : variantRepository.existsBySkuAndProductIdNot(variant.getSku(), currentId);

            if (variantSkuExists) {
                throw new BadRequestException("Variant SKU is already used");
            }
        }
    }

    private Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }

        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found"));
    }

    private MediaAsset findMediaAsset(Long id) {
        return mediaAssetRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Media asset not found"));
    }

    private ProductAttribute findAttribute(Long id) {
        return attributeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attribute not found"));
    }

    private ProductAttributeValue findAttributeValue(Long id) {
        return attributeValueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attribute value not found"));
    }

    private String resolveSlug(String requestedSlug, String name) {
        String slug = SlugUtil.from(requestedSlug == null || requestedSlug.isBlank() ? name : requestedSlug);

        if (slug.isBlank()) {
            throw new BadRequestException("Product slug is required");
        }

        return slug;
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? List.of() : values;
    }

    private Pageable pageable(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(1, Math.min(size, 60));
        return PageRequest.of(safePage, safeSize);
    }
}
