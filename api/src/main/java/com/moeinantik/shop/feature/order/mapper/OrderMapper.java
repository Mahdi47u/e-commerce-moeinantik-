package com.moeinantik.shop.feature.order.mapper;

import com.moeinantik.shop.feature.order.entity.Order;
import com.moeinantik.shop.feature.order.entity.OrderItem;
import com.moeinantik.shop.feature.order.model.OrderItemResponse;
import com.moeinantik.shop.feature.order.model.OrderResponse;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getCreatedAt(),
                order.getOrderNumber(),
                order.getStatus(),
                order.getPaymentStatus(),
                order.getSubtotal(),
                order.getShippingCost(),
                order.getTotal(),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getCustomerEmail(),
                order.getProvince(),
                order.getCity(),
                order.getAddressLine(),
                order.getPostalCode(),
                order.getNote(),
                order.getItems().stream().map(this::toItemResponse).toList()
        );
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProduct() == null ? null : item.getProduct().getId(),
                item.getProductVariant() == null ? null : item.getProductVariant().getId(),
                item.getProductName(),
                item.getProductSlug(),
                item.getVariantTitle(),
                item.getSku(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getLineTotal(),
                item.getImageUrl()
        );
    }
}
