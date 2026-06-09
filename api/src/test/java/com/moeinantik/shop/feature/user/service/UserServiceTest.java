package com.moeinantik.shop.feature.user.service;

import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.feature.user.mapper.UserMapper;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final UserService userService = new UserService(userRepository, mock(UserMapper.class));

    @Test
    void getCurrentUserRejectsMissingUser() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("missing");
        when(userRepository.findByUsername("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getCurrentUser(authentication))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Current user not found");
    }
}
