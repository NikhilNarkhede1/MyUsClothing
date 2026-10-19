import { useEffect, useState } from "react";
import ProductImage from "./ProductImage.jsx";
import { discountPercent, formatPrice } from "../utils.js";

// Product details window: pick a size and quantity, then add to the order.
export default function ProductModal({ product, onClose, onAdd }) {
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  // Close with the Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const sizes = product.sizes.split(",");
  const off = discountPercent(product.price, product.mrp);

  function handleAdd() {
    if (size === "") {
      setError("Please select a size");
      return;
    }
    onAdd(product, size, quantity);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        <ProductImage product={product} className="modal-image" />

        <div className="modal-info">
          <div className="brand-line">{product.brand} · {product.category}</div>
          <h2>{product.name}</h2>
          <div className="rating">★ {product.rating.toFixed(1)}</div>

          <div className="price-row big">
            <span className="price">{formatPrice(product.price)}</span>
            <span className="mrp">{formatPrice(product.mrp)}</span>
            {off > 0 && <span className="off">{off}% off</span>}
          </div>
          <div className="muted small">Inclusive of all taxes</div>

          <p className="description">{product.description}</p>

          <div className="field-label">
            Select size {error && <span className="error-inline">{error}</span>}
          </div>
          <div className="size-list">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={s === size ? "size-btn selected" : "size-btn"}
                onClick={() => {
                  setSize(s);
                  setError("");
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="field-label">Quantity</div>
          <div className="stepper-qty">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease">−</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} aria-label="Increase">+</button>
          </div>

          <button className="btn btn-primary btn-block" onClick={handleAdd}>
            Add to order · {formatPrice(product.price * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}
