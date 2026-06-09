package com.moeinantik.shop.feature.product.entity;

import com.moeinantik.shop.common.entity.BaseEntity;
import com.moeinantik.shop.feature.category.entity.Category;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(nullable = false, length = 220)
    private String name;

    @Column(nullable = false, unique = true, length = 240)
    private String slug;

    @Column(unique = true, length = 80)
    private String sku;

    @Column(length = 500)
    private String shortDescription;

    @Column(columnDefinition = "text")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProductStatus status = ProductStatus.DRAFT;

    @Column(nullable = false)
    private boolean featured;

    @Column(nullable = false)
    private Integer sortOrder = 0;

    @Column(length = 180)
    private String seoTitle;

    @Column(length = 300)
    private String seoDescription;

    @OrderBy("sortOrder asc, id asc")
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 50)
    private List<ProductVariant> variants = new ArrayList<>();

    @OrderBy("sortOrder asc, id asc")
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 50)
    private List<ProductGalleryImage> galleryImages = new ArrayList<>();

    @OrderBy("sortOrder asc, id asc")
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 50)
    private List<ProductAttributeAssignment> attributeAssignments = new ArrayList<>();
}
