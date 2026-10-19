package com.shop.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// One Product object = one row in the "product" table.
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private String category;   // "Men" or "Kids"
    private String type;       // tshirt, polo, shirt, jeans, hoodie, jacket, shorts, frock (used to draw the picture)
    private int price;         // selling price in rupees
    private int mrp;           // original price in rupees
    private String color;      // hex colour like #2563eb
    private String sizes;      // sizes separated by comma, e.g. "S,M,L,XL"
    private double rating;
    private String imageUrl;  // photo path like /images/products/men-classic-crew-t-shirt.jpg

    @Column(length = 600)
    private String description;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public int getMrp() { return mrp; }
    public void setMrp(int mrp) { this.mrp = mrp; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getSizes() { return sizes; }
    public void setSizes(String sizes) { this.sizes = sizes; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
