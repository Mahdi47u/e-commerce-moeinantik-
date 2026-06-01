package com.moeinantik.shop.feature.payment.service;

import com.moeinantik.shop.common.config.ZarinPalProperties;
import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.feature.order.entity.Order;
import com.moeinantik.shop.feature.order.entity.OrderStatus;
import com.moeinantik.shop.feature.order.entity.PaymentStatus;
import com.moeinantik.shop.feature.order.repository.OrderRepository;
import com.moeinantik.shop.feature.payment.entity.PaymentTransaction;
import com.moeinantik.shop.feature.payment.entity.PaymentTransactionStatus;
import com.moeinantik.shop.feature.payment.model.StartPaymentResponse;
import com.moeinantik.shop.feature.payment.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
@EnableConfigurationProperties(ZarinPalProperties.class)
public class ZarinPalPaymentService {

    private static final String GATEWAY = "ZARINPAL";

    private final ZarinPalProperties properties;
    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final RestClient.Builder restClientBuilder;

    @Transactional
    public StartPaymentResponse startPayment(Authentication authentication, Long orderId) {
        Order order = findUserOrder(authentication, orderId);

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Order is already paid");
        }

        PaymentTransaction existing = transactionRepository
                .findFirstByOrderIdAndStatusOrderByCreatedAtDesc(orderId, PaymentTransactionStatus.PENDING)
                .orElse(null);

        if (existing != null && existing.getAuthority() != null) {
            return new StartPaymentResponse(order.getId(), existing.getAuthority(), paymentUrl(existing.getAuthority()));
        }

        Map<String, Object> response = requestPayment(order);
        Map<?, ?> data = responseData(response);
        int code = intValue(data.get("code"));

        if (code != 100) {
            throw new BadRequestException("ZarinPal payment request failed");
        }

        String authority = String.valueOf(data.get("authority"));
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setOrder(order);
        transaction.setGateway(GATEWAY);
        transaction.setAuthority(authority);
        transaction.setAmount(order.getTotal());
        transaction.setStatus(PaymentTransactionStatus.PENDING);
        transactionRepository.save(transaction);

        return new StartPaymentResponse(order.getId(), authority, paymentUrl(authority));
    }

    @Transactional
    public String handleCallback(String authority, String status) {
        PaymentTransaction transaction = transactionRepository.findByAuthority(authority)
                .orElseThrow(() -> new NotFoundException("Payment transaction not found"));

        Order order = transaction.getOrder();

        if (!"OK".equalsIgnoreCase(status)) {
            transaction.setStatus(PaymentTransactionStatus.CANCELLED);
            transaction.setFailureReason("Payment cancelled by gateway");
            order.setPaymentStatus(PaymentStatus.FAILED);
            return resultUrl(order, "cancelled", null);
        }

        Map<String, Object> response = verifyPayment(transaction);
        Map<?, ?> data = responseData(response);
        int code = intValue(data.get("code"));

        if (code == 100 || code == 101) {
            String refId = data.get("ref_id") == null ? null : String.valueOf(data.get("ref_id"));
            transaction.setStatus(PaymentTransactionStatus.PAID);
            transaction.setRefId(refId);
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setStatus(OrderStatus.PROCESSING);
            return resultUrl(order, "paid", refId);
        }

        transaction.setStatus(PaymentTransactionStatus.FAILED);
        transaction.setFailureReason("ZarinPal verify failed with code " + code);
        order.setPaymentStatus(PaymentStatus.FAILED);
        return resultUrl(order, "failed", null);
    }

    private Order findUserOrder(Authentication authentication, Long orderId) {
        if (authentication == null || authentication.getName() == null) {
            throw new NotFoundException("Current user not found");
        }

        return orderRepository.findByIdAndUserUsername(orderId, authentication.getName())
                .orElseThrow(() -> new NotFoundException("Order not found"));
    }

    private Map<String, Object> requestPayment(Order order) {
        return post(properties.requestUrl(), Map.of(
                "merchant_id", properties.merchantId(),
                "amount", zarinPalAmount(order.getTotal()),
                "currency", properties.currency(),
                "callback_url", properties.callbackUrl(),
                "description", "Moein Antik order " + order.getOrderNumber(),
                "metadata", Map.of(
                        "mobile", order.getCustomerPhone(),
                        "email", order.getCustomerEmail() == null ? "" : order.getCustomerEmail(),
                        "order_id", order.getOrderNumber()
                )
        ));
    }

    private Map<String, Object> verifyPayment(PaymentTransaction transaction) {
        return post(properties.verifyUrl(), Map.of(
                "merchant_id", properties.merchantId(),
                "amount", zarinPalAmount(transaction.getAmount()),
                "authority", transaction.getAuthority()
        ));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> post(String url, Map<String, Object> body) {
        return restClientBuilder.build()
                .post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);
    }

    private Map<?, ?> responseData(Map<String, Object> response) {
        if (response == null || !(response.get("data") instanceof Map<?, ?> data)) {
            throw new BadRequestException("Invalid ZarinPal response");
        }

        return data;
    }

    private int intValue(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }

        return Integer.parseInt(String.valueOf(value));
    }

    private long zarinPalAmount(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.HALF_UP).longValueExact();
    }

    private String paymentUrl(String authority) {
        return properties.startPayUrl().replaceAll("/+$", "") + "/" + authority;
    }

    private String resultUrl(Order order, String status, String refId) {
        String url = properties.frontendResultUrl()
                + "?orderId=" + order.getId()
                + "&status=" + encode(status);

        if (refId != null) {
            url += "&refId=" + encode(refId);
        }

        return url;
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
