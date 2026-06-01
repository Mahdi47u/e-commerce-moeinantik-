package com.moeinantik.shop.feature.media.entity;

import com.moeinantik.shop.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "media_assets")
public class MediaAsset extends BaseEntity {

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false, length = 120)
    private String contentType;

    @Column(nullable = false)
    private Long sizeBytes;

    @Column(nullable = false, unique = true, length = 600)
    private String objectKey;

    @Column(nullable = false, length = 1000)
    private String url;

    private String altText;

    private Integer width;

    private Integer height;
}
