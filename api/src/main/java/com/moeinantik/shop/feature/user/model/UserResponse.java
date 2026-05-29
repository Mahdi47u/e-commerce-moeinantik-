package com.moeinantik.shop.feature.user.model;

import com.moeinantik.shop.feature.user.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private boolean enabled;
    private Set<Role> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
