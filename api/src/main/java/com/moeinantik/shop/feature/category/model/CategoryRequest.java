package com.moeinantik.shop.feature.category.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    @NotBlank
    @Size(max = 160)
    private String name;

    @Size(max = 180)
    private String slug;

    private String description;

    private Long parentId;

    private Boolean active = true;

    private Integer sortOrder = 0;

    @Size(max = 180)
    private String seoTitle;

    @Size(max = 300)
    private String seoDescription;
}
