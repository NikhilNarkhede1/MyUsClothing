import { Link, useNavigate } from "react-router-dom";
import ProductImage from "../components/ProductImage.jsx";
import Stepper from "../components/Stepper.jsx";
import { useCart } from "../CartContext.jsx";
import { formatPrice, FREE_SHIPPING_ABOVE } from "../utils.js";

export default function OrderDetails() {
  const cart = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="container page">
        <div className="empty">
          <div className="empty-title">Your order is empty</div>
          <p className="muted">Add something you like from our men's and kids' range.</p>
          <Link to="/products" className="btn btn-primary">Browse products</Link>
        </div>
      </div>
    );
  }

  const remaining = FREE_SHIPPING_ABOVE - cart.subtotal;

  return (
    <div className="container page">
      <h1 className="page-title">Order details</h1>
      <Stepper current={1} />

      <div className="two-col">
        {/* ---------- Items ---------- */}
        <section className="panel">
          <div className="panel-head">
            <h2>Items ({cart.count})</h2>
            <button className="link-btn" onClick={cart.clearCart}>Clear all</button>
          </div>

          <ul className="line-list">
            {cart.items.map((item) => (
              <li className="line" key={item.key}>
                <ProductImage product={item} className="line-image" />
                <div className="line-info">
                  <div className="brand-line">{item.brand}</div>
                  <div className="line-name">{item.name}</div>
                  <div className="muted small">Size: {item.size} · {formatPrice(item.price)} each</div>
                  <button className="link-btn danger" onClick={() => cart.removeItem(item.key)}>Remove</button>
                </div>
                <div className="line-qty">
                  <div className="stepper-qty">
                    <button onClick={() => cart.changeQuantity(item.key, item.quantity - 1)} aria-label="Decrease">−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => cart.changeQuantity(item.key, item.quantity + 1)} aria-label="Increase">+</button>
                  </div>
                </div>
                <div className="line-total">{formatPrice(item.price * item.quantity)}</div>
              </li>
            ))}
          </ul>

          <Link to="/products" className="link-arrow">← Continue shopping</Link>
        </section>

        {/* ---------- Summary ---------- */}
        <aside className="panel summary">
          <h2>Order summary</h2>
          <div className="sum-row"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
          <div className="sum-row">
            <span>Shipping</span>
            <span>{cart.shipping === 0 ? <b className="free">FREE</b> : formatPrice(cart.shipping)}</span>
          </div>
          <div className="sum-row total"><span>Total</span><span>{formatPrice(cart.total)}</span></div>

          <button className="btn btn-primary btn-block" onClick={() => navigate("/shipping")}>
            Continue to shipping
          </button>
          <p className="muted small center">You will not be charged now.</p>
        </aside>
      </div>
    </div>
  );
}
