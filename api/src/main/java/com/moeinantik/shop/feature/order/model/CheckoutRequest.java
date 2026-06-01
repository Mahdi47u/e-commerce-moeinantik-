package com.moeinantik.shop.feature.order.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequest {

    @NotBlank
    @Size(max = 180)
    private String customerName;

    @NotBlank
    @Size(max = 40)
    private String customerPhone;

    @Email
    @Size(max = 180)
    private String customerEmail;

    @NotBlank
    @Size(max = 120)
    private String province;

    @NotBlank
    @Size(max = 120)
    private String city;

    @NotBlank
    @Size(max = 500)
    private String addressLine;

    @Size(max = 40)
    private String postalCode;

    @Size(max = 500)
    private String note;
}
