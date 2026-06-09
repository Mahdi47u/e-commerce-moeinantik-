package com.moeinantik.shop.feature.page.repository;

import com.moeinantik.shop.feature.page.entity.ContentPage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContentPageRepository extends JpaRepository<ContentPage, Long> {

    List<ContentPage> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Optional<ContentPage> findBySlug(String slug);

    Optional<ContentPage> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
