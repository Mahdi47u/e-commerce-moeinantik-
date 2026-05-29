package com.moeinantik.shop.feature.auth.model;

import com.moeinantik.shop.feature.user.model.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private UserResponse user;
}
