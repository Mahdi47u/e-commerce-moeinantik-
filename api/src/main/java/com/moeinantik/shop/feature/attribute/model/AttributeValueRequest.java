package com.moeinantik.shop.feature.attribute.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttributeValueRequest {

    @NotBlank
    @Size(max = 160)
    private String value;

    @Size(max = 180)
    private String slug;

    private Integer sortOrder = 0;

    private Boolean active = true;
}
