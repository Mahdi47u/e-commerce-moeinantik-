package com.moeinantik.shop.feature.homepage.service;

import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.feature.category.mapper.CategoryMapper;
import com.moeinantik.shop.feature.category.repository.CategoryRepository;
import com.moeinantik.shop.feature.homepage.entity.HomepageSection;
import com.moeinantik.shop.feature.homepage.mapper.HomepageSectionMapper;
import com.moeinantik.shop.feature.homepage.model.HomepageResponse;
import com.moeinantik.shop.feature.homepage.model.HomepageSectionRequest;
import com.moeinantik.shop.feature.homepage.model.HomepageSectionResponse;
import com.moeinantik.shop.feature.homepage.repository.HomepageSectionRepository;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import com.moeinantik.shop.feature.product.mapper.ProductMapper;
import com.moeinantik.shop.feature.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomepageService {

    private final HomepageSectionRepository sectionRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final HomepageSectionMapper sectionMapper;
    private final ProductMapper productMapper;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public HomepageResponse getPublic() {
        List<HomepageSectionResponse> sections = sectionRepository.findAllByActiveTrueOrderBySortOrderAscCreatedAtDesc()
                .stream().map(sectionMapper::toResponse).toList();

        return new HomepageResponse(
                sections,
                productRepository.findFirst6ByStatusAndFeaturedTrueOrderBySortOrderAscCreatedAtDesc(ProductStatus.ACTIVE)
                        .stream().map(product -> productMapper.toResponse(product, true)).toList(),
                categoryRepository.findAllByActiveTrueOrderBySortOrderAscNameAsc()
                        .stream().map(categoryMapper::toResponse).toList(),
                "Moein Antik | گالری آنتیک و دکور لوکس",
                "خرید و مشاهده محصولات آنتیک، دکور لوکس و قطعات خاص برای خانه‌های ایرانی."
        );
    }

    @Transactional(readOnly = true)
    public List<HomepageSectionResponse> listAdmin() {
        return sectionRepository.findAllByOrderBySortOrderAscCreatedAtDesc().stream().map(sectionMapper::toResponse).toList();
    }

    @Transactional
    public HomepageSectionResponse create(HomepageSectionRequest request) {
        HomepageSection section = new HomepageSection();
        applyRequest(section, request);
        return sectionMapper.toResponse(sectionRepository.save(section));
    }

    @Transactional
    public HomepageSectionResponse update(Long id, HomepageSectionRequest request) {
        HomepageSection section = sectionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Homepage section not found"));
        applyRequest(section, request);
        return sectionMapper.toResponse(section);
    }

    @Transactional
    public void delete(Long id) {
        sectionRepository.delete(sectionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Homepage section not found")));
    }

    private void applyRequest(HomepageSection section, HomepageSectionRequest request) {
        section.setTitle(request.getTitle().trim());
        section.setSubtitle(blankToNull(request.getSubtitle()));
        section.setType(request.getType());
        section.setActive(request.getActive() == null || request.getActive());
        section.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        section.setCtaLabel(blankToNull(request.getCtaLabel()));
        section.setCtaHref(blankToNull(request.getCtaHref()));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
