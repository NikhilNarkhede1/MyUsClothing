package com.shop;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.shop.dto.OrderRequest;
import com.shop.dto.OrderResponse;
import com.shop.model.Order;
import com.shop.model.Product;
import com.shop.repository.OrderRepository;
import com.shop.repository.ProductRepository;
import com.shop.service.OrderService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;

@SpringBootTest
class ShopFlowTest {

    @Autowired ProductRepository productRepository;
    @Autowired OrderRepository orderRepository;
    @Autowired OrderService orderService;

    private OrderRequest validRequest(Product product, int quantity) {
        OrderRequest.Item item = new OrderRequest.Item();
        item.setProductId(product.getId());
        item.setSize(product.getSizes().split(",")[0]);
        item.setQuantity(quantity);

        OrderRequest r = new OrderRequest();
        r.setCustomerName("Test Customer");
        r.setEmail("test@example.com");
        r.setPhone("9876543210");
        r.setAddress("12 MG Road");
        r.setCity("Pune");
        r.setState("Maharashtra");
        r.setPincode("411001");
        r.getItems().add(item);
        return r;
    }

    @Test
    void everyProductHasAPhotoPathFromItsName() {
        List<Product> all = productRepository.findAll();
        for (int i = 0; i < all.size(); i++) {
            String path = all.get(i).getImageUrl();
            assertTrue(path != null && path.startsWith("/images/products/") && path.endsWith(".jpg"));
        }
        // spot check one name
        for (int i = 0; i < all.size(); i++) {
            if (all.get(i).getName().equals("Men Oxford Button-Down Shirt")) {
                assertEquals("/images/products/men-oxford-button-down-shirt.jpg", all.get(i).getImageUrl());
            }
        }
    }

    @Test
    void catalogueHasTwelveProducts() {
        List<Product> all = productRepository.findAll();
        assertEquals(12, all.size());
        int men = 0;
        int kids = 0;
        for (int i = 0; i < all.size(); i++) {
            if (all.get(i).getCategory().equals("Men")) men++;
            if (all.get(i).getCategory().equals("Kids")) kids++;
        }
        assertEquals(6, men);
        assertEquals(6, kids);
    }

    // The cheapest product in the shop
    private Product cheapestProduct() {
        List<Product> all = productRepository.findAll();
        Product cheapest = all.get(0);
        for (int i = 1; i < all.size(); i++) {
            if (all.get(i).getPrice() < cheapest.getPrice()) {
                cheapest = all.get(i);
            }
        }
        return cheapest;
    }

    @Test
    void placingAnOrderBooksItAndAddsShippingForSmallOrders() {
        Product cheap = cheapestProduct();   // one piece costs less than 1499, so shipping is charged
        assertTrue(cheap.getPrice() < 1499);
        OrderResponse response = orderService.placeOrder(validRequest(cheap, 1));

        assertTrue(response.getOrderNumber().startsWith("ORD-"));
        assertEquals(cheap.getPrice() + 99, response.getTotalAmount());
        // No mail account in tests, so the email is not sent but the order is still saved.
        assertFalse(response.isEmailSent());

        Order saved = orderRepository.findAll().get(orderRepository.findAll().size() - 1);
        assertEquals("BOOKED", saved.getStatus());
        assertEquals(1, saved.getItems().size());
    }

    @Test
    void bigOrdersGetFreeShipping() {
        Product p = cheapestProduct();
        int quantity = 5;   // 5 pieces is always above the free shipping limit
        assertTrue(p.getPrice() * quantity >= 1499);
        OrderResponse response = orderService.placeOrder(validRequest(p, quantity));
        assertEquals(p.getPrice() * quantity, response.getTotalAmount());
    }

    @Test
    void badInputIsRejected() {
        Product p = productRepository.findAll().get(0);

        OrderRequest badPhone = validRequest(p, 1);
        badPhone.setPhone("123");
        assertThrows(ResponseStatusException.class, () -> orderService.placeOrder(badPhone));

        OrderRequest badEmail = validRequest(p, 1);
        badEmail.setEmail("not-an-email");
        assertThrows(ResponseStatusException.class, () -> orderService.placeOrder(badEmail));

        OrderRequest empty = validRequest(p, 1);
        empty.getItems().clear();
        assertThrows(ResponseStatusException.class, () -> orderService.placeOrder(empty));

        OrderRequest badSize = validRequest(p, 1);
        badSize.getItems().get(0).setSize("XXXXL");
        assertThrows(ResponseStatusException.class, () -> orderService.placeOrder(badSize));
    }
}
