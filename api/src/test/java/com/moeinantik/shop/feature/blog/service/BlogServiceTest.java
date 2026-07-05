package com.moeinantik.shop.feature.blog.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.feature.blog.mapper.BlogMapper;
import com.moeinantik.shop.feature.blog.model.BlogPostRequest;
import com.moeinantik.shop.feature.blog.repository.BlogCategoryRepository;
import com.moeinantik.shop.feature.blog.repository.BlogPostRepository;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class BlogServiceTest {

    private final BlogPostRepository postRepository = mock(BlogPostRepository.class);
    private final BlogCategoryRepository categoryRepository = mock(BlogCategoryRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final BlogService blogService = new BlogService(postRepository, categoryRepository, userRepository, new BlogMapper());

    @Test
    void createPostRejectsDuplicateSlug() {
        BlogPostRequest request = new BlogPostRequest();
        request.setTitle("Spring Styling Guide");
        request.setContent("A practical guide for styling an antique console.");

        when(postRepository.existsBySlug("spring-styling-guide")).thenReturn(true);

        assertThatThrownBy(() -> blogService.createPost(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Blog post slug is already used");
    }
}
