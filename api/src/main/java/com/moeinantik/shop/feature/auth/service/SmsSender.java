package com.moeinantik.shop.feature.auth.service;

public interface SmsSender {

    void sendOtp(String phone, String code);
}
