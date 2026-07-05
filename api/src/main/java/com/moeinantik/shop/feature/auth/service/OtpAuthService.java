package com.moeinantik.shop.feature.auth.service;

import com.moeinantik.shop.common.cache.CacheKeyBuilder;
import com.moeinantik.shop.common.cache.RedisCacheService;
import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.security.JwtService;
import com.moeinantik.shop.feature.auth.config.OtpProperties;
import com.moeinantik.shop.feature.auth.model.AuthResponse;
import com.moeinantik.shop.feature.auth.model.OtpRequestResponse;
import com.moeinantik.shop.feature.user.entity.Role;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.mapper.UserMapper;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OtpAuthService {

    private static final String OTP_CODE_NAMESPACE = "auth:otp:code";
    private static final String OTP_ATTEMPTS_NAMESPACE = "auth:otp:attempts";
    private static final String OTP_REQUESTS_NAMESPACE = "auth:otp:requests";
    private static final String OTP_COOLDOWN_NAMESPACE = "auth:otp:cooldown";

    private final RedisCacheService cacheService;
    private final CacheKeyBuilder keyBuilder;
    private final OtpProperties otpProperties;
    private final PhoneNumberNormalizer phoneNumberNormalizer;
    private final SmsSender smsSender;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpRequestResponse requestOtp(String rawPhone) {
        String phone = phoneNumberNormalizer.normalize(rawPhone);
        String cooldownKey = keyBuilder.build(OTP_COOLDOWN_NAMESPACE, phone);

        if (cacheService.exists(cooldownKey)) {
            throw new BadRequestException("Please wait before requesting another code");
        }

        String requestCountKey = keyBuilder.build(OTP_REQUESTS_NAMESPACE, phone);
        long requestCount = cacheService.increment(requestCountKey, otpProperties.requestWindow());
        if (requestCount > otpProperties.maxRequestsPerWindow()) {
            throw new BadRequestException("Too many OTP requests. Please try again later");
        }

        String code = generateCode();
        cacheService.put(
                keyBuilder.build(OTP_CODE_NAMESPACE, phone),
                passwordEncoder.encode(code),
                otpProperties.ttl()
        );
        cacheService.delete(keyBuilder.build(OTP_ATTEMPTS_NAMESPACE, phone));
        cacheService.put(cooldownKey, "1", otpProperties.resendCooldown());
        smsSender.sendOtp(phone, code);

        return new OtpRequestResponse(
                phone,
                otpProperties.ttl().toSeconds(),
                otpProperties.resendCooldown().toSeconds()
        );
    }

    @Transactional
    public AuthResponse verifyOtp(String rawPhone, String code) {
        String phone = phoneNumberNormalizer.normalize(rawPhone);
        String codeKey = keyBuilder.build(OTP_CODE_NAMESPACE, phone);
        String encodedCode = cacheService.get(codeKey)
                .orElseThrow(() -> new BadRequestException("OTP code has expired"));

        String attemptsKey = keyBuilder.build(OTP_ATTEMPTS_NAMESPACE, phone);
        long attempts = cacheService.increment(attemptsKey, otpProperties.ttl());
        if (attempts > otpProperties.maxVerifyAttempts()) {
            cacheService.delete(codeKey);
            throw new BadRequestException("Too many failed attempts. Please request a new code");
        }

        if (!isAcceptedCode(code, encodedCode)) {
            throw new BadRequestException("Invalid OTP code");
        }

        cacheService.delete(codeKey);
        cacheService.delete(attemptsKey);
        cacheService.delete(keyBuilder.build(OTP_COOLDOWN_NAMESPACE, phone));

        UserEntity user = userRepository.findByPhone(phone)
                .orElseGet(() -> createOtpUser(phone));
        applyConfiguredAdminRole(user, phone);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, userMapper.toResponse(user));
    }

    private UserEntity createOtpUser(String phone) {
        UserEntity user = new UserEntity();
        user.setUsername("user_" + phone);
        user.setEmail(phone + "@otp.moeinantik.local");
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.getRoles().add(Role.USER);

        return userRepository.save(user);
    }

    private void applyConfiguredAdminRole(UserEntity user, String phone) {
        boolean isAdminPhone = otpProperties.adminPhones().stream()
                .map(phoneNumberNormalizer::normalize)
                .anyMatch(phone::equals);

        if (isAdminPhone) {
            user.getRoles().add(Role.ADMIN);
        }
    }

    private boolean isAcceptedCode(String code, String encodedCode) {
        return passwordEncoder.matches(code, encodedCode)
                || (otpProperties.devCode() != null && otpProperties.devCode().equals(code));
    }

    private String generateCode() {
        int bound = (int) Math.pow(10, otpProperties.codeLength());
        int floor = bound / 10;
        int code = secureRandom.nextInt(bound - floor) + floor;

        return String.valueOf(code);
    }
}
