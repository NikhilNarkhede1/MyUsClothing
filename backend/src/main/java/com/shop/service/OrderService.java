package com.shop.service;

import com.shop.dto.OrderRequest;
import com.shop.dto.OrderResponse;
import com.shop.model.Order;
import com.shop.model.OrderItem;
import com.shop.model.Product;
import com.shop.repository.OrderRepository;
import com.shop.repository.ProductRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

    @Value("${app.shipping.free-above}")
    private int freeShippingAbove;

    @Value("${app.shipping.fee}")
    private int shippingFee;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
                        EmailService emailService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.emailService = emailService;
    }

    public OrderResponse placeOrder(OrderRequest request) {
        checkRequest(request);

        Order order = new Order();
        order.setCustomerName(request.getCustomerName().trim());
        order.setEmail(request.getEmail().trim());
        order.setPhone(request.getPhone().trim());
        order.setAddress(request.getAddress().trim());
        order.setCity(request.getCity().trim());
        order.setState(request.getState().trim());
        order.setPincode(request.getPincode().trim());
        order.setStatus("BOOKED");
        order.setOrderDate(LocalDateTime.now());

        // Build the order lines. The price always comes from the database, never from the browser.
        int subtotal = 0;
        for (int i = 0; i < request.getItems().size(); i++) {
            OrderRequest.Item line = request.getItems().get(i);

            Product product = productRepository.findById(line.getProductId()).orElse(null);
            if (product == null) {
                throw bad("One of the products in your order no longer exists");
            }
            if (!sizeExists(product, line.getSize())) {
                throw bad("Size " + line.getSize() + " is not available for " + product.getName());
            }
            if (line.getQuantity() < 1 || line.getQuantity() > 10) {
                throw bad("Quantity must be between 1 and 10");
            }

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setSize(line.getSize());
            item.setQuantity(line.getQuantity());
            item.setUnitPrice(product.getPrice());
            order.getItems().add(item);

            subtotal = subtotal + item.getLineTotal();
        }

        int fee = 0;
        if (subtotal < freeShippingAbove) {
            fee = shippingFee;
        }
        order.setSubtotal(subtotal);
        order.setShippingFee(fee);
        order.setTotalAmount(subtotal + fee);

        // Save once to get the id, then use the id to make the order number.
        order = orderRepository.save(order);
        order.setOrderNumber("ORD-" + (100000 + order.getId()));

        // Send the email. If it fails the order is still booked.
        boolean sent = emailService.sendOrderEmail(order);
        order.setEmailSent(sent);
        order = orderRepository.save(order);

        return new OrderResponse(order.getOrderNumber(), order.getEmail(), order.getTotalAmount(), sent);
    }

    // ---------- checks ----------

    private void checkRequest(OrderRequest r) {
        if (r == null) {
            throw bad("Order details are missing");
        }
        if (r.getItems() == null || r.getItems().size() == 0) {
            throw bad("Your order is empty");
        }
        if (r.getItems().size() > 20) {
            throw bad("Too many items in one order");
        }
        if (isBlank(r.getCustomerName())) {
            throw bad("Please enter your full name");
        }
        if (isBlank(r.getEmail()) || !looksLikeEmail(r.getEmail().trim())) {
            throw bad("Please enter a valid email address");
        }
        if (isBlank(r.getPhone()) || r.getPhone().trim().length() != 10 || !onlyDigits(r.getPhone().trim())) {
            throw bad("Please enter a 10 digit mobile number");
        }
        if (isBlank(r.getAddress())) {
            throw bad("Please enter your address");
        }
        if (isBlank(r.getCity())) {
            throw bad("Please enter your city");
        }
        if (isBlank(r.getState())) {
            throw bad("Please select your state");
        }
        if (isBlank(r.getPincode()) || r.getPincode().trim().length() != 6 || !onlyDigits(r.getPincode().trim())) {
            throw bad("Please enter a 6 digit pincode");
        }
        for (int i = 0; i < r.getItems().size(); i++) {
            OrderRequest.Item line = r.getItems().get(i);
            if (line == null || line.getProductId() == null || isBlank(line.getSize())) {
                throw bad("An item in your order is incomplete");
            }
        }
    }

    private boolean sizeExists(Product product, String size) {
        String[] sizes = product.getSizes().split(",");
        for (int i = 0; i < sizes.length; i++) {
            if (sizes[i].trim().equals(size)) {
                return true;
            }
        }
        return false;
    }

    private boolean isBlank(String text) {
        return text == null || text.trim().length() == 0;
    }

    private boolean onlyDigits(String text) {
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c < '0' || c > '9') {
                return false;
            }
        }
        return true;
    }

    private boolean looksLikeEmail(String email) {
        int at = email.indexOf('@');
        int lastDot = email.lastIndexOf('.');
        // needs: something before @, a dot after @, and something after the dot. No spaces.
        return at > 0 && lastDot > at + 1 && lastDot < email.length() - 1 && !email.contains(" ");
    }

    private ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
