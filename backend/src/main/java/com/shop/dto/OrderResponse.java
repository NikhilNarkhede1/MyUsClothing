package com.shop.dto;

// What we send back after the order is booked.
public class OrderResponse {

    private String orderNumber;
    private String email;
    private int totalAmount;
    private boolean emailSent;

    public OrderResponse(String orderNumber, String email, int totalAmount, boolean emailSent) {
        this.orderNumber = orderNumber;
        this.email = email;
        this.totalAmount = totalAmount;
        this.emailSent = emailSent;
    }

    public String getOrderNumber() { return orderNumber; }
    public String getEmail() { return email; }
    public int getTotalAmount() { return totalAmount; }
    public boolean isEmailSent() { return emailSent; }
}
