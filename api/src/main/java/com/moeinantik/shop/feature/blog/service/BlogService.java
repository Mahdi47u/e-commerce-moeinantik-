package com.moeinantik.shop.feature.blog.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.common.util.SlugUtil;
import com.moeinantik.shop.feature.blog.entity.BlogCategory;
import com.moeinantik.shop.feature.blog.entity.BlogPost;
import com.moeinantik.shop.feature.blog.mapper.BlogMapper;
import com.moeinantik.shop.feature.blog.model.BlogCategoryRequest;
import com.moeinantik.shop.feature.blog.model.BlogCategoryResponse;
import com.moeinantik.shop.feature.blog.model.BlogPostRequest;
import com.moeinantik.shop.feature.blog.model.BlogPostResponse;
import com.moeinantik.shop.feature.blog.repository.BlogCategoryRepository;
import com.moeinantik.shop.feature.blog.repository.BlogPostRepository;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogPostRepository postRepository;
    private final BlogCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final BlogMapper blogMapper;

    @Transactional
    public BlogCategoryResponse createCategory(BlogCategoryRequest request) {
        BlogCategory category = new BlogCategory();
        applyCategoryRequest(category, request);
        validateUniqueCategorySlug(category.getSlug(), null);

        return blogMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional(readOnly = true)
    public List<BlogCategoryResponse> listAdminCategories() {
        return categoryRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(blogMapper::toCategoryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BlogCategoryResponse> listPublicCategories() {
        return categoryRepository.findAllByActiveTrueOrderBySortOrderAscNameAsc().stream()
                .map(blogMapper::toCategoryResponse)
                .toList();
    }

    @Transactional
    public BlogCategoryResponse updateCategory(Long id, BlogCategoryRequest request) {
        BlogCategory category = findCategory(id);
        applyCategoryRequest(category, request);
        validateUniqueCategorySlug(category.getSlug(), id);

        return blogMapper.toCategoryResponse(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.delete(findCategory(id));
    }

    @Transactional
    public BlogPostResponse createPost(BlogPostRequest request) {
        BlogPost post = new BlogPost();
        applyPostRequest(post, request);
        validateUniquePostSlug(post.getSlug(), null);
        post.setAuthor(resolveCurrentUser());

        return blogMapper.toPostResponse(postRepository.save(post));
    }

    @Transactional(readOnly = true)
    public List<BlogPostResponse> listAdminPosts(int page, int size) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable(page, size)).stream()
                .map(blogMapper::toPostResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BlogPostResponse> listPublicPosts(String categorySlug, String query, int page, int size) {
        String normalizedQuery = query == null ? "" : query.trim();
        List<BlogPost> posts;

        if (!normalizedQuery.isBlank()) {
            posts = postRepository.findAllByPublishedTrueAndTitleContainingIgnoreCaseOrderByPublishedAtDescCreatedAtDesc(
                    normalizedQuery,
                    pageable(page, size)
            );
        } else if (categorySlug != null && !categorySlug.isBlank()) {
            posts = postRepository.findAllByCategorySlugAndPublishedTrueOrderByPublishedAtDescCreatedAtDesc(
                    categorySlug,
                    pageable(page, size)
            );
        } else {
            posts = postRepository.findAllByPublishedTrueOrderByPublishedAtDescCreatedAtDesc(pageable(page, size));
        }

        return posts.stream().map(blogMapper::toPostResponse).toList();
    }

    @Transactional(readOnly = true)
    public BlogPostResponse getAdminPost(Long id) {
        return blogMapper.toPostResponse(findPost(id));
    }

    @Transactional(readOnly = true)
    public BlogPostResponse getPublicPost(String slug) {
        return blogMapper.toPostResponse(postRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new NotFoundException("Blog post not found")));
    }

    @Transactional
    public BlogPostResponse updatePost(Long id, BlogPostRequest request) {
        BlogPost post = findPost(id);
        boolean wasPublished = post.isPublished();
        applyPostRequest(post, request);
        validateUniquePostSlug(post.getSlug(), id);
        if (!wasPublished && post.isPublished() && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }

        return blogMapper.toPostResponse(post);
    }

    @Transactional
    public void deletePost(Long id) {
        postRepository.delete(findPost(id));
    }

    private void applyCategoryRequest(BlogCategory category, BlogCategoryRequest request) {
        category.setName(request.getName().trim());
        category.setSlug(resolveSlug(request.getSlug(), request.getName(), "Blog category slug is required"));
        category.setDescription(blankToNull(request.getDescription()));
        category.setActive(request.getActive() == null || request.getActive());
        category.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
    }

    private void applyPostRequest(BlogPost post, BlogPostRequest request) {
        boolean publish = Boolean.TRUE.equals(request.getPublished());

        post.setTitle(request.getTitle().trim());
        post.setSlug(resolveSlug(request.getSlug(), request.getTitle(), "Blog post slug is required"));
        post.setExcerpt(blankToNull(request.getExcerpt()));
        post.setContent(request.getContent().trim());
        post.setCoverImageUrl(blankToNull(request.getCoverImageUrl()));
        post.setCategory(resolveCategory(request.getCategoryId()));
        post.setPublished(publish);
        post.setFeatured(Boolean.TRUE.equals(request.getFeatured()));
        post.setSeoTitle(blankToNull(request.getSeoTitle()));
        post.setSeoDescription(blankToNull(request.getSeoDescription()));
        post.setReadingMinutes(estimateReadingMinutes(post.getContent()));
        if (publish && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }
        if (!publish) {
            post.setPublishedAt(null);
        }
    }

    private BlogCategory resolveCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        BlogCategory category = findCategory(categoryId);
        if (!category.isActive()) {
            throw new BadRequestException("Blog category is inactive");
        }
        return category;
    }

    private UserEntity resolveCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String username = authentication.getName();
        if (username == null || username.equals("anonymousUser")) {
            return null;
        }

        return userRepository.findByUsername(username).orElse(null);
    }

    private BlogCategory findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Blog category not found"));
    }

    private BlogPost findPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Blog post not found"));
    }

    private void validateUniqueCategorySlug(String slug, Long currentId) {
        boolean exists = currentId == null ? categoryRepository.existsBySlug(slug) : categoryRepository.existsBySlugAndIdNot(slug, currentId);
        if (exists) {
            throw new BadRequestException("Blog category slug is already used");
        }
    }

    private void validateUniquePostSlug(String slug, Long currentId) {
        boolean exists = currentId == null ? postRepository.existsBySlug(slug) : postRepository.existsBySlugAndIdNot(slug, currentId);
        if (exists) {
            throw new BadRequestException("Blog post slug is already used");
        }
    }

    private String resolveSlug(String requestedSlug, String fallback, String message) {
        String slug = SlugUtil.from(requestedSlug == null || requestedSlug.isBlank() ? fallback : requestedSlug);
        if (slug.isBlank()) {
            throw new BadRequestException(message);
        }
        return slug;
    }

    private int estimateReadingMinutes(String content) {
        String plain = content == null ? "" : content.replaceAll("<[^>]+>", " ").trim();
        if (plain.isBlank()) {
            return 1;
        }
        int words = plain.split("\\s+").length;
        return Math.max(1, (int) Math.ceil(words / 180.0));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private Pageable pageable(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(1, Math.min(size, 100));
        return PageRequest.of(safePage, safeSize);
    }
}
