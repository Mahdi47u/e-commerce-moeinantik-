package com.moeinantik.shop.feature.auth.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.security.JwtService;
import com.moeinantik.shop.feature.auth.model.RegisterRequest;
import com.moeinantik.shop.feature.user.mapper.UserMapper;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final AuthService authService = new AuthService(
            userRepository,
            mock(UserMapper.class),
            mock(PasswordEncoder.class),
            mock(AuthenticationManager.class),
            mock(UserDetailsService.class),
            mock(JwtService.class),
            mock(PhoneNumberNormalizer.class)
    );

    @Test
    void registerRejectsTakenUsername() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("mahdi");
        request.setEmail("mahdi@example.com");

        when(userRepository.existsByUsername("mahdi")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Username is already taken");
    }
}
