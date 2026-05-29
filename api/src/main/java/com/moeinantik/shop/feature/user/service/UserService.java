package com.moeinantik.shop.feature.user.service;

import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.mapper.UserMapper;
import com.moeinantik.shop.feature.user.model.UpdateProfileRequest;
import com.moeinantik.shop.feature.user.model.UserResponse;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Authentication authentication) {
        return userMapper.toResponse(getCurrentUserEntity(authentication));
    }

    @Transactional
    public UserResponse updateCurrentUser(Authentication authentication, UpdateProfileRequest request) {
        UserEntity user = getCurrentUserEntity(authentication);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        return userMapper.toResponse(user);
    }

    private UserEntity getCurrentUserEntity(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new NotFoundException("Current user not found");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new NotFoundException("Current user not found"));
    }
}
