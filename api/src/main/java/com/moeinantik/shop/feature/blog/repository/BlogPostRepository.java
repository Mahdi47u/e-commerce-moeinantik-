package com.moeinantik.shop.feature.blog.repository;

import com.moeinantik.shop.feature.blog.entity.BlogPost;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    @EntityGraph(attributePaths = {"category", "author"})
    List<BlogPost> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "author"})
    List<BlogPost> findAllByPublishedTrueOrderByPublishedAtDescCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "author"})
    List<BlogPost> findAllByCategorySlugAndPublishedTrueOrderByPublishedAtDescCreatedAtDesc(String categorySlug, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "author"})
    List<BlogPost> findAllByPublishedTrueAndTitleContainingIgnoreCaseOrderByPublishedAtDescCreatedAtDesc(String query, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "author"})
    Optional<BlogPost> findBySlug(String slug);

    @EntityGraph(attributePaths = {"category", "author"})
    Optional<BlogPost> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
