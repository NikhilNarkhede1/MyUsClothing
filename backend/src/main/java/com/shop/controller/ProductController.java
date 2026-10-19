package com.shop.controller;

import com.shop.model.Product;
import com.shop.repository.ProductRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // GET /api/products  ->  all 12 products
    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }
}
