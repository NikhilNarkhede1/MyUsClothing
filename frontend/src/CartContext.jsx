import { createContext, useContext, useEffect, useState } from "react";
import { shippingFor } from "./utils.js";

// The cart is kept here so every page can read it.
// It is also saved in the browser (localStorage) so a refresh does not empty it.

const CartContext = createContext(null);
const STORAGE_KEY = "myusclothing-cart";

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore: start with an empty cart
  }
  return [];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  // The same product in a different size is a different line.
  function lineKey(productId, size) {
    return productId + "-" + size;
  }

  function addItem(product, size, quantity) {
    const key = lineKey(product.id, size);
    const found = items.find((i) => i.key === key);
    if (found) {
      setItems(
        items.map((i) => {
          if (i.key === key) {
            return { ...i, quantity: Math.min(10, i.quantity + quantity) };
          }
          return i;
        })
      );
    } else {
      setItems([
        ...items,
        {
          key: key,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          type: product.type,
          color: product.color,
          imageUrl: product.imageUrl,
          price: product.price,
          size: size,
          quantity: quantity,
        },
      ]);
    }
  }

  function changeQuantity(key, quantity) {
    if (quantity < 1) {
      quantity = 1;
    }
    if (quantity > 10) {
      quantity = 10;
    }
    setItems(items.map((i) => (i.key === key ? { ...i, quantity: quantity } : i)));
  }

  function removeItem(key) {
    setItems(items.filter((i) => i.key !== key));
  }

  function clearCart() {
    setItems([]);
  }

  let count = 0;
  let subtotal = 0;
  for (const item of items) {
    count = count + item.quantity;
    subtotal = subtotal + item.price * item.quantity;
  }
  const shipping = shippingFor(subtotal);

  const value = {
    items,
    count,
    subtotal,
    shipping,
    total: subtotal + shipping,
    addItem,
    changeQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
