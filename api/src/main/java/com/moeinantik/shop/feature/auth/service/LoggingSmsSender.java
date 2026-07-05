package com.moeinantik.shop.feature.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Slf4j
@Primary
@Service
public class LoggingSmsSender implements SmsSender {

    @Override
    public void sendOtp(String phone, String code) {
        log.info("Development OTP for {} is {}", phone, code);
    }
}
