package com.moeinantik.shop.feature.auth.controller;

import com.moeinantik.shop.feature.auth.model.AuthResponse;
import com.moeinantik.shop.feature.auth.model.LoginRequest;
import com.moeinantik.shop.feature.auth.model.OtpRequest;
import com.moeinantik.shop.feature.auth.model.OtpRequestResponse;
import com.moeinantik.shop.feature.auth.model.OtpVerifyRequest;
import com.moeinantik.shop.feature.auth.model.RegisterRequest;
import com.moeinantik.shop.feature.auth.service.AuthService;
import com.moeinantik.shop.feature.auth.service.OtpAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final OtpAuthService otpAuthService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/otp/request")
    public ResponseEntity<OtpRequestResponse> requestOtp(@Valid @RequestBody OtpRequest request) {
        return ResponseEntity.ok(otpAuthService.requestOtp(request.getPhone()));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(otpAuthService.verifyOtp(request.getPhone(), request.getCode()));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
