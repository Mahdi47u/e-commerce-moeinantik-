package com.moeinantik.shop.feature.blog.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlogCategoryRequest {

    @NotBlank
    @Size(max = 160)
    private String name;

    @Size(max = 180)
    private String slug;

    @Size(max = 500)
    private String description;

    private Boolean active = true;

    private Integer sortOrder = 0;
}
