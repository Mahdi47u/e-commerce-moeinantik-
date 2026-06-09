package com.moeinantik.shop.feature.media.service;

import com.moeinantik.shop.common.config.MinioProperties;
import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.feature.media.entity.MediaAsset;
import com.moeinantik.shop.feature.media.mapper.MediaAssetMapper;
import com.moeinantik.shop.feature.media.model.MediaAssetResponse;
import com.moeinantik.shop.feature.media.repository.MediaAssetRepository;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;
    private final MediaAssetRepository mediaAssetRepository;
    private final MediaAssetMapper mediaAssetMapper;

    @Transactional
    public MediaAssetResponse upload(MultipartFile file, String altText) {
        validateFile(file);

        String originalFileName = cleanOriginalFileName(file.getOriginalFilename());
        String extension = extensionFrom(originalFileName);
        String fileName = UUID.randomUUID() + extension;
        String objectKey = buildObjectKey(fileName);

        ImageSize imageSize = readImageSize(file);
        putObject(file, objectKey);

        MediaAsset asset = new MediaAsset();
        asset.setFileName(fileName);
        asset.setOriginalFileName(originalFileName);
        asset.setContentType(file.getContentType());
        asset.setSizeBytes(file.getSize());
        asset.setObjectKey(objectKey);
        asset.setUrl(buildPublicUrl(objectKey));
        asset.setAltText(normalizeAltText(altText));
        asset.setWidth(imageSize.width());
        asset.setHeight(imageSize.height());

        return mediaAssetMapper.toResponse(mediaAssetRepository.save(asset));
    }

    @Transactional(readOnly = true)
    public List<MediaAssetResponse> list(int page, int size) {
        return mediaAssetRepository.findAllByOrderByCreatedAtDesc(pageable(page, size)).stream()
                .map(mediaAssetMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MediaAssetResponse get(Long id) {
        return mediaAssetMapper.toResponse(findById(id));
    }

    @Transactional
    public void delete(Long id) {
        MediaAsset asset = findById(id);
        removeObject(asset.getObjectKey());
        mediaAssetRepository.delete(asset);
    }

    private MediaAsset findById(Long id) {
        return mediaAssetRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Media asset not found"));
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Only JPG, PNG, WEBP, and GIF images are allowed");
        }
    }

    private String cleanOriginalFileName(String originalFileName) {
        if (originalFileName == null || originalFileName.isBlank()) {
            return "upload";
        }

        String normalized = originalFileName.replace("\\", "/");
        return normalized.substring(normalized.lastIndexOf("/") + 1);
    }

    private String extensionFrom(String fileName) {
        int dotIndex = fileName.lastIndexOf(".");

        if (dotIndex < 0 || dotIndex == fileName.length() - 1) {
            return "";
        }

        return fileName.substring(dotIndex).toLowerCase(Locale.ROOT);
    }

    private String buildObjectKey(String fileName) {
        LocalDate today = LocalDate.now();
        return "media/%d/%02d/%s".formatted(today.getYear(), today.getMonthValue(), fileName);
    }

    private String buildPublicUrl(String objectKey) {
        return minioProperties.publicUrl().replaceAll("/+$", "") + "/" + objectKey;
    }

    private String normalizeAltText(String altText) {
        if (altText == null || altText.isBlank()) {
            return null;
        }

        return altText.trim();
    }

    private ImageSize readImageSize(MultipartFile file) {
        if ("image/webp".equals(file.getContentType())) {
            return new ImageSize(null, null);
        }

        try (InputStream inputStream = file.getInputStream()) {
            BufferedImage image = ImageIO.read(inputStream);

            if (image == null) {
                throw new BadRequestException("Uploaded file is not a valid image");
            }

            return new ImageSize(image.getWidth(), image.getHeight());
        } catch (IOException exception) {
            throw new BadRequestException("Could not read uploaded image");
        }
    }

    private void putObject(MultipartFile file, String objectKey) {
        try {
            ensureBucketExists();

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioProperties.bucket())
                            .object(objectKey)
                            .contentType(file.getContentType())
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .build()
            );
        } catch (Exception exception) {
            throw new BadRequestException("Could not upload media file");
        }
    }

    private void ensureBucketExists() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(minioProperties.bucket())
                        .build()
        );

        if (!exists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket(minioProperties.bucket())
                            .build()
            );
        }
    }

    private void removeObject(String objectKey) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(minioProperties.bucket())
                            .object(objectKey)
                            .build()
            );
        } catch (Exception exception) {
            throw new BadRequestException("Could not delete media file");
        }
    }

    private record ImageSize(Integer width, Integer height) {
    }

    private Pageable pageable(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(1, Math.min(size, 100));
        return PageRequest.of(safePage, safeSize);
    }
}
