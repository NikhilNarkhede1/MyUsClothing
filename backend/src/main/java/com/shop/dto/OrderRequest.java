package com.shop.dto;

import java.util.ArrayList;
import java.util.List;

// The JSON the browser sends when the customer presses "Place Order".
public class OrderRequest {

    private String customerName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private List<Item> items = new ArrayList<>();

    // One cart line. The browser sends only the id, size and quantity.
    // The price is NOT sent: the server reads the real price from the database.
    public static class Item {
        private Long productId;
        private String size;
        private int quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}
