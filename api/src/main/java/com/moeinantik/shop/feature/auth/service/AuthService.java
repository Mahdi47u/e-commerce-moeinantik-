package com.moeinantik.shop.feature.auth.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.security.JwtService;
import com.moeinantik.shop.feature.auth.model.AuthResponse;
import com.moeinantik.shop.feature.auth.model.LoginRequest;
import com.moeinantik.shop.feature.auth.model.RegisterRequest;
import com.moeinantik.shop.feature.user.entity.Role;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.mapper.UserMapper;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already taken");
        }

        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.getRoles().add(Role.USER);

        UserEntity saved = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(saved.getUsername());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, userMapper.toResponse(saved));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        UserEntity user = userRepository.findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, userMapper.toResponse(user));
    }
}
