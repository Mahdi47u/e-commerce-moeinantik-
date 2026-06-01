package com.moeinantik.shop.feature.attribute.model;

import com.moeinantik.shop.feature.attribute.entity.AttributeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttributeRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 140)
    private String slug;

    @NotNull
    private AttributeType type = AttributeType.TEXT;

    private Boolean filterable = true;

    private Boolean active = true;

    private Integer sortOrder = 0;
}
