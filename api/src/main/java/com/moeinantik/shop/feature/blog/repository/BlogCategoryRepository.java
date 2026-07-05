package com.moeinantik.shop.feature.blog.repository;

import com.moeinantik.shop.feature.blog.entity.BlogCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogCategoryRepository extends JpaRepository<BlogCategory, Long> {

    List<BlogCategory> findAllByOrderBySortOrderAscNameAsc();

    List<BlogCategory> findAllByActiveTrueOrderBySortOrderAscNameAsc();

    Optional<BlogCategory> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
