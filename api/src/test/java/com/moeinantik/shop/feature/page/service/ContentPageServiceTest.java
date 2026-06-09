package com.moeinantik.shop.feature.page.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.feature.page.mapper.ContentPageMapper;
import com.moeinantik.shop.feature.page.model.ContentPageRequest;
import com.moeinantik.shop.feature.page.repository.ContentPageRepository;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ContentPageServiceTest {

    private final ContentPageRepository pageRepository = mock(ContentPageRepository.class);
    private final ContentPageService pageService = new ContentPageService(pageRepository, new ContentPageMapper());

    @Test
    void createRejectsDuplicateSlug() {
        ContentPageRequest request = new ContentPageRequest();
        request.setTitle("About Gallery");
        request.setContent("Story");

        when(pageRepository.existsBySlug("about-gallery")).thenReturn(true);

        assertThatThrownBy(() -> pageService.create(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Page slug is already used");
    }
}
