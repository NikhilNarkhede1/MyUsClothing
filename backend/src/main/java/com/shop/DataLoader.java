package com.shop;

import com.shop.model.Product;
import com.shop.repository.ProductRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Runs every time the backend starts and makes the database match the product list below.
//   - a product in the list but not in the database  -> it is added
//   - a product in both                              -> its details are updated
//   - a product in the database but not in the list  -> it is removed
// So to change the shop, just edit the list below and restart. No need to delete backend/data.
//
// Photos: each product's photo path is made from its name.
//   "Men Oxford Button-Down Shirt"  ->  /images/products/men-oxford-button-down-shirt.jpg
//   Put the photo in  frontend/public/images/products/  with that file name.
@Component
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataLoader(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        List<Product> catalogue = buildCatalogue();
        List<Product> existing = productRepository.findAll();

        // 1) Remove products that are no longer in the list
        for (int i = 0; i < existing.size(); i++) {
            if (findByName(catalogue, existing.get(i).getName()) == null) {
                productRepository.delete(existing.get(i));
            }
        }

        // 2) Add new products, update the ones that already exist
        for (int i = 0; i < catalogue.size(); i++) {
            Product wanted = catalogue.get(i);
            Product saved = findByName(existing, wanted.getName());
            if (saved == null) {
                productRepository.save(wanted);
            } else {
                saved.setBrand(wanted.getBrand());
                saved.setCategory(wanted.getCategory());
                saved.setType(wanted.getType());
                saved.setPrice(wanted.getPrice());
                saved.setMrp(wanted.getMrp());
                saved.setColor(wanted.getColor());
                saved.setSizes(wanted.getSizes());
                saved.setRating(wanted.getRating());
                saved.setDescription(wanted.getDescription());
                saved.setImageUrl(wanted.getImageUrl());
                productRepository.save(saved);
            }
        }
    }

    private Product findByName(List<Product> list, String name) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getName().equals(name)) {
                return list.get(i);
            }
        }
        return null;
    }

    // ------------------------------------------------------------------
    //  THE PRODUCT LIST  (6 Men + 6 Kids)
    //  add(name, category, type, price, mrp, colour, sizes, rating, description)
    //  type is only used for the drawing shown when a photo file is missing: shirt or tshirt
    //  colour is the soft background behind the photo
    // ------------------------------------------------------------------
    private List<Product> buildCatalogue() {
        List<Product> list = new ArrayList<>();

        String men = "S,M,L,XL,XXL";
        String kids = "2-3Y,4-5Y,6-7Y,8-9Y,10-11Y";

        // ---------- MEN (6) ----------
        add(list, "Men Oxford Button-Down Shirt", "Men", "shirt", 1099, 2499, "#eab308", men, 4.5,
                "Long sleeve button-down shirt in a soft pale yellow with a chest pocket. Smart enough for work, easy enough for weekends.");
        add(list, "Men Blue Checked Casual Shirt", "Men", "shirt", 999, 2299, "#1e40af", men, 4.3,
                "Relaxed checked shirt in shades of blue. Wear it buttoned up or open over a plain tee.");
        add(list, "Men Pink Linen Shirt", "Men", "shirt", 1299, 2799, "#f472b6", men, 4.4,
                "Lightweight linen-look shirt in soft pink with a button-down collar and chest pocket. Airy and comfortable in warm weather.");
        add(list, "Men White Mandarin Collar Shirt", "Men", "shirt", 1199, 2599, "#94a3b8", men, 4.4,
                "Clean white shirt with a mandarin collar and chest pocket. Simple, cool and easy to style for festivals or evenings out.");
        add(list, "Men Teal Casual Shirt", "Men", "shirt", 1299, 2799, "#0f766e", men, 4.2,
                "Long sleeve shirt in deep teal with a button-down collar and chest pocket. A colour that works with jeans and chinos.");
        add(list, "Men Grey Formal Shirt", "Men", "shirt", 1399, 2999, "#78716c", men, 4.1,
                "Classic formal shirt in a muted grey with a sharp collar and full button front. A dependable choice for office days.");

        // ---------- KIDS (6) ----------
        add(list, "Boys Colour Block Casual Shirt", "Kids", "shirt", 749, 1599, "#7f1d1d", kids, 4.5,
                "Maroon, white and navy colour block shirt with a collar and short rolled sleeves. A sharp look for outings and parties.");
        add(list, "Boys White Oxford Shirt", "Kids", "shirt", 699, 1499, "#cbd5e1", kids, 4.6,
                "Crisp white shirt with a button-down collar and chest pocket. Neat for school events, festivals and family functions.");
        add(list, "Boys Multicolour Print Shirt", "Kids", "shirt", 649, 1399, "#f59e0b", kids, 4.3,
                "Bright geometric print shirt in blue, orange and green. Fun, colourful and full of energy.");
        add(list, "Boys Mustard Graphic T-Shirt", "Kids", "tshirt", 399, 899, "#d97706", kids, 4.2,
                "Round neck mustard t-shirt with a bold graphic print. Comfortable everyday wear for active kids.");
        add(list, "Boys White Mandarin Collar Shirt", "Kids", "shirt", 599, 1299, "#94a3b8", kids, 4.2,
                "Short sleeve white shirt with a mandarin collar and small badge detail. Looks great with jeans or shorts.");
        add(list, "Boys Dot Print Half Sleeve Shirt", "Kids", "shirt", 549, 1199, "#38bdf8", kids, 4.0,
                "Half sleeve shirt with a playful dot and line print on white. Light and easy for warm days.");

        return list;
    }

    private void add(List<Product> list, String name, String category, String type, int price, int mrp,
                     String color, String sizes, double rating, String description) {
        Product p = new Product();
        p.setName(name);
        p.setBrand(category.equals("Men") ? "MyUs Men" : "MyUs Kids");
        p.setCategory(category);
        p.setType(type);
        p.setPrice(price);
        p.setMrp(mrp);
        p.setColor(color);
        p.setSizes(sizes);
        p.setRating(rating);
        p.setDescription(description);
        p.setImageUrl("/images/products/" + fileName(name) + ".jpg");
        list.add(p);
    }

    // "Men Oxford Button-Down Shirt" -> "men-oxford-button-down-shirt"
    private String fileName(String name) {
        String lower = name.toLowerCase();
        String result = "";
        for (int i = 0; i < lower.length(); i++) {
            char c = lower.charAt(i);
            if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
                result = result + c;
            } else if (result.length() > 0 && !result.endsWith("-")) {
                result = result + "-";
            }
        }
        if (result.endsWith("-")) {
            result = result.substring(0, result.length() - 1);
        }
        return result;
    }
}
