import { useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "../components/ProductImage.jsx";
import Stepper from "../components/Stepper.jsx";
import { useCart } from "../CartContext.jsx";
import { placeOrder } from "../api.js";
import { INDIAN_STATES, formatPrice } from "../utils.js";

const EMPTY_FORM = {
  customerName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

// true if the text has only the digits 0-9
function onlyDigits(text) {
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) < "0" || text.charAt(i) > "9") {
      return false;
    }
  }
  return true;
}

// Returns an object with one message per wrong field. Empty object = all good.
function validate(form) {
  const errors = {};
  if (form.customerName.trim() === "") {
    errors.customerName = "Enter your full name";
  }
  const email = form.email.trim();
  if (email === "" || email.indexOf("@") < 1 || email.lastIndexOf(".") < email.indexOf("@") + 2 || email.indexOf(" ") >= 0 || email.endsWith(".")) {
    errors.email = "Enter a valid email address";
  }
  const phone = form.phone.trim();
  if (phone.length !== 10 || !onlyDigits(phone)) {
    errors.phone = "Enter a 10 digit mobile number";
  }
  if (form.address.trim() === "") {
    errors.address = "Enter your address";
  }
  if (form.city.trim() === "") {
    errors.city = "Enter your city";
  }
  if (form.state === "") {
    errors.state = "Select your state";
  }
  const pincode = form.pincode.trim();
  if (pincode.length !== 6 || !onlyDigits(pincode)) {
    errors.pincode = "Enter a 6 digit pincode";
  }
  return errors;
}

export default function Shipping() {
  const cart = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState(null);   // filled after the order is booked

  function update(field, value) {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setServerError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }

    // Only id, size and quantity are sent. The server looks up the real prices.
    const lines = [];
    for (const item of cart.items) {
      lines.push({ productId: item.productId, size: item.size, quantity: item.quantity });
    }

    setSubmitting(true);
    try {
      const data = await placeOrder({
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state,
        pincode: form.pincode.trim(),
        items: lines,
      });
      setResult(data);
      cart.clearCart();
      window.scrollTo(0, 0);
    } catch (err) {
      setServerError(err.message);
    }
    setSubmitting(false);
  }

  // ---------- 3. Confirmation ----------
  if (result) {
    return (
      <div className="container page">
        <Stepper current={3} />
        <div className="confirm">
          <div className="confirm-icon" aria-hidden="true">✓</div>
          <h1>Order booked</h1>
          <div className="order-number">Order number <b>{result.orderNumber}</b></div>

          {result.emailSent ? (
            <p>
              We have emailed the order details to <b>{result.email}</b>. Please reply to that email
              with your payment details so we can confirm and dispatch your order.
            </p>
          ) : (
            <div className="note warn">
              Your order is booked, but the confirmation email was not sent. Please contact MyUsClothing support and share order number <b>{result.orderNumber}</b>. The store owner must configure SMTP email before automatic emails can work.
            </div>
          )}

          <div className="confirm-total">
            <span>Amount to pay</span>
            <b>{formatPrice(result.totalAmount)}</b>
          </div>

          <div className="confirm-steps">
            <div><span className="how-number">1</span> Check your inbox (and spam folder)</div>
            <div><span className="how-number">2</span> Reply with your payment details</div>
            <div><span className="how-number">3</span> We confirm and ship your order</div>
          </div>

          <Link to="/products" className="btn btn-primary">Continue shopping</Link>
        </div>
      </div>
    );
  }

  // ---------- Empty ----------
  if (cart.items.length === 0) {
    return (
      <div className="container page">
        <div className="empty">
          <div className="empty-title">There is nothing to ship yet</div>
          <p className="muted">Add products to your order first.</p>
          <Link to="/products" className="btn btn-primary">Browse products</Link>
        </div>
      </div>
    );
  }

  // ---------- 2. Shipping form ----------
  function field(name, label, props) {
    return (
      <div className={"form-field " + (errors[name] ? "has-error" : "")}>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          value={form[name]}
          onChange={(e) => update(name, e.target.value)}
          {...props}
        />
        {errors[name] && <div className="error-text">{errors[name]}</div>}
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Shipping details</h1>
      <Stepper current={2} />

      <form className="two-col" onSubmit={handlePlaceOrder} noValidate>
        <section className="panel">
          <h2>Where should we deliver?</h2>

          <div className="form-grid">
            {field("customerName", "Full name", { autoComplete: "name", placeholder: "e.g. Rahul Sharma" })}
            {field("email", "Email address", { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
            {field("phone", "Mobile number", { type: "tel", inputMode: "numeric", maxLength: 10, autoComplete: "tel", placeholder: "10 digit number" })}
            {field("pincode", "Pincode", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code", placeholder: "6 digit pincode" })}

            <div className={"form-field full " + (errors.address ? "has-error" : "")}>
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                rows="3"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                autoComplete="street-address"
                placeholder="House no, building, street, area"
              />
              {errors.address && <div className="error-text">{errors.address}</div>}
            </div>

            {field("city", "City", { autoComplete: "address-level2", placeholder: "City" })}

            <div className={"form-field " + (errors.state ? "has-error" : "")}>
              <label htmlFor="state">State</label>
              <select id="state" value={form.state} onChange={(e) => update("state", e.target.value)}>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <div className="error-text">{errors.state}</div>}
            </div>
          </div>

          <div className="note">
            <b>No online payment is collected.</b> Place your order first. If email is configured, we will send your order summary and next-step payment instructions to the email address you provide. Never email your card number, CVV, PIN, or OTP.
          </div>
        </section>

        <aside className="panel summary">
          <h2>Your order</h2>
          <ul className="mini-list">
            {cart.items.map((item) => (
              <li key={item.key}>
                <ProductImage product={item} className="mini-image" />
                <div className="mini-info">
                  <div className="mini-name">{item.name}</div>
                  <div className="muted small">Size {item.size} · Qty {item.quantity}</div>
                </div>
                <div>{formatPrice(item.price * item.quantity)}</div>
              </li>
            ))}
          </ul>

          <div className="sum-row"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
          <div className="sum-row">
            <span>Shipping</span>
            <span>{cart.shipping === 0 ? <b className="free">FREE</b> : formatPrice(cart.shipping)}</span>
          </div>
          <div className="sum-row total"><span>Total to pay</span><span>{formatPrice(cart.total)}</span></div>

          {serverError && <div className="alert" role="alert">{serverError}</div>}

          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={submitting}>
            {submitting ? "Placing order..." : "Place Order"}
          </button>
          <Link to="/order" className="link-arrow center-link">← Back to order details</Link>
        </aside>
      </form>
    </div>
  );
}
