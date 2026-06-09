package com.moeinantik.shop.feature.payment.service;

import com.moeinantik.shop.common.config.ZarinPalProperties;
import com.moeinantik.shop.feature.order.entity.Order;
import com.moeinantik.shop.feature.order.entity.PaymentStatus;
import com.moeinantik.shop.feature.order.repository.OrderRepository;
import com.moeinantik.shop.feature.payment.entity.PaymentTransaction;
import com.moeinantik.shop.feature.payment.entity.PaymentTransactionStatus;
import com.moeinantik.shop.feature.payment.repository.PaymentTransactionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ZarinPalPaymentServiceTest {

    private final PaymentTransactionRepository transactionRepository = mock(PaymentTransactionRepository.class);
    private final ZarinPalPaymentService paymentService = new ZarinPalPaymentService(
            new ZarinPalProperties(
                    "merchant",
                    "https://request",
                    "https://verify",
                    "https://start",
                    "https://callback",
                    "https://frontend/result",
                    "IRT"
            ),
            mock(OrderRepository.class),
            transactionRepository,
            RestClient.builder()
    );

    @Test
    void callbackMarksTransactionCancelledWhenGatewayStatusIsNotOk() {
        Order order = new Order();
        order.setId(12L);
        order.setPaymentStatus(PaymentStatus.PENDING);

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setAuthority("A123");
        transaction.setAmount(BigDecimal.TEN);
        transaction.setOrder(order);
        transaction.setStatus(PaymentTransactionStatus.PENDING);

        when(transactionRepository.findByAuthority("A123")).thenReturn(Optional.of(transaction));

        String redirectUrl = paymentService.handleCallback("A123", "NOK");

        assertThat(transaction.getStatus()).isEqualTo(PaymentTransactionStatus.CANCELLED);
        assertThat(order.getPaymentStatus()).isEqualTo(PaymentStatus.FAILED);
        assertThat(redirectUrl).contains("status=cancelled");
    }
}
