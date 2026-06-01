package com.moeinantik.shop.feature.payment.repository;

import com.moeinantik.shop.feature.payment.entity.PaymentTransaction;
import com.moeinantik.shop.feature.payment.entity.PaymentTransactionStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    @EntityGraph(attributePaths = "order")
    Optional<PaymentTransaction> findByAuthority(String authority);

    Optional<PaymentTransaction> findFirstByOrderIdAndStatusOrderByCreatedAtDesc(
            Long orderId,
            PaymentTransactionStatus status
    );
}
