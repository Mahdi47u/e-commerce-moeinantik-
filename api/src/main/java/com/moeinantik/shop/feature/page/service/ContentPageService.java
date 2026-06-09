package com.moeinantik.shop.feature.page.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.common.util.SlugUtil;
import com.moeinantik.shop.feature.page.entity.ContentPage;
import com.moeinantik.shop.feature.page.mapper.ContentPageMapper;
import com.moeinantik.shop.feature.page.model.ContentPageRequest;
import com.moeinantik.shop.feature.page.model.ContentPageResponse;
import com.moeinantik.shop.feature.page.repository.ContentPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentPageService {

    private final ContentPageRepository pageRepository;
    private final ContentPageMapper pageMapper;

    @Transactional
    public ContentPageResponse create(ContentPageRequest request) {
        ContentPage page = new ContentPage();
        applyRequest(page, request);
        validateUniqueSlug(page.getSlug(), null);
        return pageMapper.toResponse(pageRepository.save(page));
    }

    @Transactional(readOnly = true)
    public List<ContentPageResponse> listAdmin(int page, int size) {
        return pageRepository.findAllByOrderByCreatedAtDesc(pageable(page, size)).stream().map(pageMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ContentPageResponse getPublic(String slug) {
        return pageMapper.toResponse(pageRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new NotFoundException("Page not found")));
    }

    @Transactional
    public ContentPageResponse update(Long id, ContentPageRequest request) {
        ContentPage page = pageRepository.findById(id).orElseThrow(() -> new NotFoundException("Page not found"));
        applyRequest(page, request);
        validateUniqueSlug(page.getSlug(), id);
        return pageMapper.toResponse(page);
    }

    @Transactional
    public void delete(Long id) {
        pageRepository.delete(pageRepository.findById(id).orElseThrow(() -> new NotFoundException("Page not found")));
    }

    private void applyRequest(ContentPage page, ContentPageRequest request) {
        page.setTitle(request.getTitle().trim());
        page.setSlug(resolveSlug(request.getSlug(), request.getTitle()));
        page.setExcerpt(blankToNull(request.getExcerpt()));
        page.setContent(request.getContent().trim());
        page.setPublished(Boolean.TRUE.equals(request.getPublished()));
        page.setSeoTitle(blankToNull(request.getSeoTitle()));
        page.setSeoDescription(blankToNull(request.getSeoDescription()));
    }

    private String resolveSlug(String requestedSlug, String title) {
        String slug = SlugUtil.from(requestedSlug == null || requestedSlug.isBlank() ? title : requestedSlug);
        if (slug.isBlank()) {
            throw new BadRequestException("Page slug is required");
        }
        return slug;
    }

    private void validateUniqueSlug(String slug, Long currentId) {
        boolean exists = currentId == null ? pageRepository.existsBySlug(slug) : pageRepository.existsBySlugAndIdNot(slug, currentId);
        if (exists) {
            throw new BadRequestException("Page slug is already used");
        }
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
