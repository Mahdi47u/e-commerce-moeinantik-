package com.moeinantik.shop.common.config;

import com.moeinantik.shop.common.cache.CacheProperties;
import com.moeinantik.shop.feature.auth.config.OtpProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({CacheProperties.class, OtpProperties.class})
public class RedisConfig {
}
