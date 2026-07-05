package com.moeinantik.shop.feature.auth.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpVerifyRequest {

    @NotBlank
    @Size(max = 30)
    private String phone;

    @NotBlank
    @Pattern(regexp = "\\d{4,8}")
    private String code;
}
