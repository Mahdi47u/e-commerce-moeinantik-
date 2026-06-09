package com.moeinantik.shop.feature.page.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentPageRequest {

    @NotBlank
    @Size(max = 220)
    private String title;

    @Size(max = 240)
    private String slug;

    @Size(max = 500)
    private String excerpt;

    @NotBlank
    private String content;

    private Boolean published = false;

    @Size(max = 180)
    private String seoTitle;

    @Size(max = 300)
    private String seoDescription;
}
