package com.moeinantik.shop.feature.blog.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlogPostRequest {

    @NotBlank
    @Size(max = 220)
    private String title;

    @Size(max = 240)
    private String slug;

    @Size(max = 600)
    private String excerpt;

    @NotBlank
    private String content;

    @Size(max = 700)
    private String coverImageUrl;

    private Long categoryId;

    private Boolean published = false;

    private Boolean featured = false;

    @Size(max = 180)
    private String seoTitle;

    @Size(max = 300)
    private String seoDescription;
}
