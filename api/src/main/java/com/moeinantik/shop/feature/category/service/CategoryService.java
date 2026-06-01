package com.moeinantik.shop.feature.category.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.common.util.SlugUtil;
import com.moeinantik.shop.feature.category.entity.Category;
import com.moeinantik.shop.feature.category.mapper.CategoryMapper;
import com.moeinantik.shop.feature.category.model.CategoryRequest;
import com.moeinantik.shop.feature.category.model.CategoryResponse;
import com.moeinantik.shop.feature.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category category = new Category();
        applyRequest(category, request);
        validateUniqueSlug(category.getSlug(), null);

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAdmin() {
        return categoryRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listPublicTree() {
        return buildTree(categoryRepository.findAllByActiveTrueOrderBySortOrderAscNameAsc());
    }

    @Transactional(readOnly = true)
    public CategoryResponse get(Long id) {
        return categoryMapper.toResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public CategoryResponse getBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Category not found"));

        if (!category.isActive()) {
            throw new NotFoundException("Category not found");
        }

        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findById(id);
        applyRequest(category, request);
        validateUniqueSlug(category.getSlug(), id);

        return categoryMapper.toResponse(category);
    }

    @Transactional
    public void delete(Long id) {
        Category category = findById(id);

        if (categoryRepository.countByParentId(id) > 0) {
            throw new BadRequestException("Category has child categories");
        }

        categoryRepository.delete(category);
    }

    private void applyRequest(Category category, CategoryRequest request) {
        category.setName(request.getName().trim());
        category.setSlug(resolveSlug(request.getSlug(), request.getName()));
        category.setDescription(blankToNull(request.getDescription()));
        category.setActive(request.getActive() == null || request.getActive());
        category.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        category.setSeoTitle(blankToNull(request.getSeoTitle()));
        category.setSeoDescription(blankToNull(request.getSeoDescription()));
        category.setParent(resolveParent(category, request.getParentId()));
    }

    private Category resolveParent(Category category, Long parentId) {
        if (parentId == null) {
            return null;
        }

        if (category.getId() != null && category.getId().equals(parentId)) {
            throw new BadRequestException("Category cannot be its own parent");
        }

        Category parent = findById(parentId);

        Category current = parent;
        while (current != null) {
            if (category.getId() != null && category.getId().equals(current.getId())) {
                throw new BadRequestException("Category parent would create a cycle");
            }
            current = current.getParent();
        }

        return parent;
    }

    private String resolveSlug(String requestedSlug, String name) {
        String slug = SlugUtil.from(requestedSlug == null || requestedSlug.isBlank() ? name : requestedSlug);

        if (slug.isBlank()) {
            throw new BadRequestException("Category slug is required");
        }

        return slug;
    }

    private void validateUniqueSlug(String slug, Long currentId) {
        boolean exists = currentId == null
                ? categoryRepository.existsBySlug(slug)
                : categoryRepository.existsBySlugAndIdNot(slug, currentId);

        if (exists) {
            throw new BadRequestException("Category slug is already used");
        }
    }

    private Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private List<CategoryResponse> buildTree(List<Category> categories) {
        Map<Long, List<Category>> childrenByParentId = new LinkedHashMap<>();

        for (Category category : categories) {
            Long parentId = category.getParent() == null ? null : category.getParent().getId();
            childrenByParentId.computeIfAbsent(parentId, ignored -> new ArrayList<>()).add(category);
        }

        return toTreeNodes(childrenByParentId, null);
    }

    private List<CategoryResponse> toTreeNodes(Map<Long, List<Category>> childrenByParentId, Long parentId) {
        return childrenByParentId.getOrDefault(parentId, List.of()).stream()
                .map(category -> categoryMapper.toResponse(category, toTreeNodes(childrenByParentId, category.getId())))
                .toList();
    }
}
