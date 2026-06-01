package com.moeinantik.shop.feature.product.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductAttributeAssignmentRequest {

    @NotNull
    private Long attributeId;

    private Long attributeValueId;

    @Size(max = 500)
    private String valueText;

    private BigDecimal valueNumber;

    private Boolean valueBoolean;

    private Integer sortOrder = 0;
}
