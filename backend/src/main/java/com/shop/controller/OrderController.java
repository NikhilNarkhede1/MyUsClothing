package com.shop.controller;

import com.shop.dto.OrderRequest;
import com.shop.dto.OrderResponse;
import com.shop.service.OrderService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // POST /api/orders  ->  books the order and emails the customer
    @PostMapping
    public OrderResponse placeOrder(@RequestBody OrderRequest request) {
        return orderService.placeOrder(request);
    }
}
