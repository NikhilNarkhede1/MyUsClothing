package com.shop.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// One line inside an order, for example "2 x Men Polo T-Shirt, size M".
// We copy the name and price into the order, so old orders never change if a product changes later.
@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String productName;
    private String size;
    private int quantity;
    private int unitPrice;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getUnitPrice() { return unitPrice; }
    public void setUnitPrice(int unitPrice) { this.unitPrice = unitPrice; }

    public int getLineTotal() { return unitPrice * quantity; }
}
