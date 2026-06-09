package com.moeinantik.shop.feature.homepage.model;

import com.moeinantik.shop.feature.homepage.entity.HomepageSectionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HomepageSectionRequest {

    @NotBlank
    @Size(max = 220)
    private String title;

    @Size(max = 500)
    private String subtitle;

    @NotNull
    private HomepageSectionType type = HomepageSectionType.CUSTOM;

    private Boolean active = true;

    private Integer sortOrder = 0;

    @Size(max = 120)
    private String ctaLabel;

    @Size(max = 500)
    private String ctaHref;
}
