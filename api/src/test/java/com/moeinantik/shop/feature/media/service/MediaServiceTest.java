package com.moeinantik.shop.feature.media.service;

import com.moeinantik.shop.common.config.MinioProperties;
import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.feature.media.mapper.MediaAssetMapper;
import com.moeinantik.shop.feature.media.repository.MediaAssetRepository;
import io.minio.MinioClient;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

class MediaServiceTest {

    private final MediaService mediaService = new MediaService(
            mock(MinioClient.class),
            new MinioProperties("http://localhost:9000", "key", "secret", "shop-media", "http://localhost:9000/shop-media"),
            mock(MediaAssetRepository.class),
            new MediaAssetMapper()
    );

    @Test
    void uploadRejectsNonImageContentType() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "note.txt",
                "text/plain",
                "hello".getBytes()
        );

        assertThatThrownBy(() -> mediaService.upload(file, null))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Only JPG, PNG, WEBP, and GIF images are allowed");
    }
}
