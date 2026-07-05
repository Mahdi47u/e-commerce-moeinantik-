package com.moeinantik.shop.feature.auth.service;

import com.moeinantik.shop.common.cache.CacheKeyBuilder;
import com.moeinantik.shop.common.cache.CacheProperties;
import com.moeinantik.shop.common.cache.RedisCacheService;
import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.security.JwtService;
import com.moeinantik.shop.feature.auth.config.OtpProperties;
import com.moeinantik.shop.feature.user.entity.Role;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.mapper.UserMapper;
import com.moeinantik.shop.feature.user.model.UserResponse;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OtpAuthServiceTest {

    private final RedisCacheService cacheService = mock(RedisCacheService.class);
    private final SmsSender smsSender = mock(SmsSender.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final UserMapper userMapper = mock(UserMapper.class);
    private final UserDetailsService userDetailsService = mock(UserDetailsService.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final OtpAuthService otpAuthService = new OtpAuthService(
            cacheService,
            new CacheKeyBuilder(new CacheProperties("moein-antik")),
            new OtpProperties(6, Duration.ofMinutes(2), Duration.ofSeconds(60), Duration.ofMinutes(15), 5, 5, "123456", List.of("09155733360")),
            new PhoneNumberNormalizer(),
            smsSender,
            passwordEncoder,
            userRepository,
            userMapper,
            userDetailsService,
            jwtService
    );

    @Test
    void requestOtpStoresHashedCodeAndSendsSms() {
        when(cacheService.exists("moein-antik:auth-otp-cooldown:09123456789")).thenReturn(false);
        when(cacheService.increment("moein-antik:auth-otp-requests:09123456789", Duration.ofMinutes(15))).thenReturn(1L);

        var response = otpAuthService.requestOtp("+98 912 345 6789");

        assertThat(response.phone()).isEqualTo("09123456789");
        assertThat(response.expiresInSeconds()).isEqualTo(120);
        verify(cacheService).put(eq("moein-antik:auth-otp-code:09123456789"), any(String.class), eq(Duration.ofMinutes(2)));
        verify(smsSender).sendOtp(eq("09123456789"), any(String.class));
    }

    @Test
    void requestOtpRejectsCooldown() {
        when(cacheService.exists("moein-antik:auth-otp-cooldown:09123456789")).thenReturn(true);

        assertThatThrownBy(() -> otpAuthService.requestOtp("09123456789"))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Please wait before requesting another code");
    }

    @Test
    void verifyOtpLogsInExistingUser() {
        String encodedCode = passwordEncoder.encode("123456");
        UserEntity user = new UserEntity();
        user.setUsername("mahdi");
        user.setEmail("mahdi@example.com");
        user.setPhone("09123456789");
        user.setPassword("hashed");
        user.getRoles().add(Role.USER);
        UserDetails userDetails = User.withUsername("mahdi").password("hashed").roles("USER").build();
        UserResponse userResponse = new UserResponse();
        userResponse.setUsername("mahdi");

        when(cacheService.get("moein-antik:auth-otp-code:09123456789")).thenReturn(Optional.of(encodedCode));
        when(cacheService.increment("moein-antik:auth-otp-attempts:09123456789", Duration.ofMinutes(2))).thenReturn(1L);
        when(userRepository.findByPhone("09123456789")).thenReturn(Optional.of(user));
        when(userDetailsService.loadUserByUsername("mahdi")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("token");
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        var response = otpAuthService.verifyOtp("09123456789", "123456");

        assertThat(response.getToken()).isEqualTo("token");
        assertThat(response.getUser().getUsername()).isEqualTo("mahdi");
        verify(cacheService).delete("moein-antik:auth-otp-code:09123456789");
    }

    @Test
    void verifyOtpAcceptsConfiguredDevCode() {
        String encodedCode = passwordEncoder.encode("654321");
        UserEntity user = new UserEntity();
        user.setUsername("mahdi");
        user.setEmail("mahdi@example.com");
        user.setPhone("09123456789");
        user.setPassword("hashed");
        user.getRoles().add(Role.USER);
        UserDetails userDetails = User.withUsername("mahdi").password("hashed").roles("USER").build();
        UserResponse userResponse = new UserResponse();
        userResponse.setUsername("mahdi");

        when(cacheService.get("moein-antik:auth-otp-code:09123456789")).thenReturn(Optional.of(encodedCode));
        when(cacheService.increment("moein-antik:auth-otp-attempts:09123456789", Duration.ofMinutes(2))).thenReturn(1L);
        when(userRepository.findByPhone("09123456789")).thenReturn(Optional.of(user));
        when(userDetailsService.loadUserByUsername("mahdi")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("token");
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        var response = otpAuthService.verifyOtp("09123456789", "123456");

        assertThat(response.getToken()).isEqualTo("token");
        assertThat(response.getUser().getUsername()).isEqualTo("mahdi");
        verify(cacheService).delete("moein-antik:auth-otp-code:09123456789");
    }

    @Test
    void verifyOtpCreatesConfiguredAdminPhoneWithAdminRole() {
        String encodedCode = passwordEncoder.encode("123456");
        UserDetails userDetails = User.withUsername("user_09155733360").password("hashed").roles("USER", "ADMIN").build();
        UserResponse userResponse = new UserResponse();
        userResponse.setUsername("user_09155733360");

        when(cacheService.get("moein-antik:auth-otp-code:09155733360")).thenReturn(Optional.of(encodedCode));
        when(cacheService.increment("moein-antik:auth-otp-attempts:09155733360", Duration.ofMinutes(2))).thenReturn(1L);
        when(userRepository.findByPhone("09155733360")).thenReturn(Optional.empty());
        when(userRepository.save(any(UserEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userDetailsService.loadUserByUsername("user_09155733360")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("token");
        when(userMapper.toResponse(any(UserEntity.class))).thenReturn(userResponse);

        var response = otpAuthService.verifyOtp("09155733360", "123456");

        assertThat(response.getToken()).isEqualTo("token");
        assertThat(response.getUser().getUsername()).isEqualTo("user_09155733360");
        verify(userRepository).save(org.mockito.ArgumentMatchers.argThat(user ->
                user.getPhone().equals("09155733360")
                        && user.getRoles().contains(Role.USER)
                        && user.getRoles().contains(Role.ADMIN)
        ));
    }
}
