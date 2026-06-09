package com.moeinantik.shop.feature.order.repository;

import com.moeinantik.shop.feature.order.entity.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByUserUsernameOrderByCreatedAtDesc(String username, Pageable pageable);

    List<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = "items")
    Optional<Order> findByIdAndUserUsername(Long id, String username);

    @Override
    @EntityGraph(attributePaths = "items")
    Optional<Order> findById(Long id);

    boolean existsByOrderNumber(String orderNumber);
}
