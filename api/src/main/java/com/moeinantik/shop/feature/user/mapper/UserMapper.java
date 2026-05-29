package com.moeinantik.shop.feature.user.mapper;

import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.model.UserResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(UserEntity user);
}
