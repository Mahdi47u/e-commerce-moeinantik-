package com.moeinantik.shop.feature.media.repository;

import com.moeinantik.shop.feature.media.entity.MediaAsset;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {

    List<MediaAsset> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
