package com.moeinantik.shop.feature.homepage.repository;

import com.moeinantik.shop.feature.homepage.entity.HomepageSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomepageSectionRepository extends JpaRepository<HomepageSection, Long> {

    List<HomepageSection> findAllByOrderBySortOrderAscCreatedAtDesc();

    List<HomepageSection> findAllByActiveTrueOrderBySortOrderAscCreatedAtDesc();
}
