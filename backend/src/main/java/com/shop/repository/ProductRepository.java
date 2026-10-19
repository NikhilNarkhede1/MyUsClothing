package com.shop.repository;

import com.shop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

// JpaRepository gives us save(), findAll(), findById(), count() ... without writing SQL.
public interface ProductRepository extends JpaRepository<Product, Long> {
}
