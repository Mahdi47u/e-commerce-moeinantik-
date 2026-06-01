package com.moeinantik.shop.feature.order.service;

import com.moeinantik.shop.common.exception.BadRequestException;
import com.moeinantik.shop.common.exception.NotFoundException;
import com.moeinantik.shop.feature.cart.entity.Cart;
import com.moeinantik.shop.feature.cart.entity.CartItem;
import com.moeinantik.shop.feature.cart.repository.CartRepository;
import com.moeinantik.shop.feature.order.entity.Order;
import com.moeinantik.shop.feature.order.entity.OrderItem;
import com.moeinantik.shop.feature.order.entity.OrderStatus;
import com.moeinantik.shop.feature.order.entity.PaymentStatus;
import com.moeinantik.shop.feature.order.mapper.OrderMapper;
import com.moeinantik.shop.feature.order.model.CheckoutRequest;
import com.moeinantik.shop.feature.order.model.OrderResponse;
import com.moeinantik.shop.feature.order.repository.OrderRepository;
import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductGalleryImage;
import com.moeinantik.shop.feature.product.entity.ProductStatus;
import com.moeinantik.shop.feature.product.entity.ProductVariant;
import com.moeinantik.shop.feature.user.entity.UserEntity;
import com.moeinantik.shop.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final DateTimeFormatter ORDER_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse checkout(Authentication authentication, CheckoutRequest request) {
        UserEntity user = currentUser(authentication);
        Cart cart = cartRepository.findByUserUsername(user.getUsername())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setPaymentStatus(PaymentStatus.PENDING);
        applyCheckoutDetails(order, request);

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            ProductVariant variant = cartItem.getProductVariant();
            validateVariantForCheckout(variant, cartItem.getQuantity());

            OrderItem orderItem = toOrderItem(order, cartItem);
            order.getItems().add(orderItem);
            subtotal = subtotal.add(orderItem.getLineTotal());
            variant.setStockQuantity(variant.getStockQuantity() - cartItem.getQuantity());
        }

        order.setSubtotal(subtotal);
        order.setShippingCost(BigDecimal.ZERO);
        order.setTotal(subtotal);

        Order saved = orderRepository.save(order);
        cart.getItems().clear();

        return orderMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> listMine(Authentication authentication) {
        return orderRepository.findAllByUserUsernameOrderByCreatedAtDesc(currentUser(authentication).getUsername()).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getMine(Authentication authentication, Long id) {
        String username = currentUser(authentication).getUsername();
        return orderMapper.toResponse(orderRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new NotFoundException("Order not found")));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> listAdmin() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    private void applyCheckoutDetails(Order order, CheckoutRequest request) {
        order.setCustomerName(request.getCustomerName().trim());
        order.setCustomerPhone(request.getCustomerPhone().trim());
        order.setCustomerEmail(blankToNull(request.getCustomerEmail()));
        order.setProvince(request.getProvince().trim());
        order.setCity(request.getCity().trim());
        order.setAddressLine(request.getAddressLine().trim());
        order.setPostalCode(blankToNull(request.getPostalCode()));
        order.setNote(blankToNull(request.getNote()));
    }

    private OrderItem toOrderItem(Order order, CartItem cartItem) {
        ProductVariant variant = cartItem.getProductVariant();
        Product product = variant.getProduct();
        BigDecimal lineTotal = variant.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setProductVariant(variant);
        item.setProductName(product.getName());
        item.setProductSlug(product.getSlug());
        item.setVariantTitle(variant.getTitle());
        item.setSku(variant.getSku());
        item.setUnitPrice(variant.getPrice());
        item.setQuantity(cartItem.getQuantity());
        item.setLineTotal(lineTotal);
        item.setImageUrl(primaryImageUrl(product));
        return item;
    }

    private void validateVariantForCheckout(ProductVariant variant, int quantity) {
        if (!variant.isActive() || variant.getProduct().getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("Product variant is not available");
        }

        if (quantity > variant.getStockQuantity()) {
            throw new BadRequestException("Requested quantity is not available");
        }
    }

    private String generateOrderNumber() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String candidate = "MA-%s-%06d".formatted(
                    LocalDate.now().format(ORDER_DATE_FORMAT),
                    ThreadLocalRandom.current().nextInt(0, 1_000_000)
            );

            if (!orderRepository.existsByOrderNumber(candidate)) {
                return candidate;
            }
        }

        throw new BadRequestException("Could not generate order number");
    }

    private UserEntity currentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new NotFoundException("Current user not found");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new NotFoundException("Current user not found"));
    }

    private String primaryImageUrl(Product product) {
        return product.getGalleryImages().stream()
                .min(Comparator.comparing((ProductGalleryImage image) -> !image.isPrimaryImage())
                        .thenComparing(ProductGalleryImage::getSortOrder))
                .map(image -> image.getMediaAsset().getUrl())
                .orElse(null);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
