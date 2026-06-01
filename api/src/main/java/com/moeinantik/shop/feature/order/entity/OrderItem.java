package com.moeinantik.shop.feature.order.entity;

import com.moeinantik.shop.common.entity.BaseEntity;
import com.moeinantik.shop.feature.product.entity.Product;
import com.moeinantik.shop.feature.product.entity.ProductVariant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "order_items")
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @Column(nullable = false, length = 220)
    private String productName;

    @Column(nullable = false, length = 240)
    private String productSlug;

    @Column(nullable = false, length = 160)
    private String variantTitle;

    @Column(length = 100)
    private String sku;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal lineTotal;

    @Column(length = 1000)
    private String imageUrl;
}
