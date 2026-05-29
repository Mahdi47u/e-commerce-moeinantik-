package com.moeinantik.shop.feature.user.repository;

import com.moeinantik.shop.feature.user.entity.UserEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    @EntityGraph(attributePaths = "roles")
    Optional<UserEntity> findByUsername(String username);

    @EntityGraph(attributePaths = "roles")
    Optional<UserEntity> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
