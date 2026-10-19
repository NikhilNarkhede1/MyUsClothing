import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import ProductImage from "../components/ProductImage.jsx";
import { ErrorBox, Loading } from "../components/Status.jsx";
import { useProducts } from "../useProducts.js";
import { FREE_SHIPPING_ABOVE, formatPrice } from "../utils.js";

const TRUST = [
  { title: "Free shipping", text: "On orders above " + formatPrice(FREE_SHIPPING_ABOVE) },
  { title: "Easy returns", text: "7-day return on all items" },
  { title: "Quality checked", text: "Every piece inspected before dispatch" },
  { title: "Simple ordering", text: "No payment on the website" },
];

const STEPS = [
  { title: "Choose your clothes", text: "Pick size and quantity from our men's and kids' range." },
  { title: "Add shipping details", text: "Tell us where to deliver and press Place Order." },
  { title: "Pay by email", text: "We email you the order summary and ask for your payment details." },
];

// Finds the Nth product of a category (0 = first), for the big pictures on this page.
// If it is not loaded yet, returns a plain stand-in so the drawing is shown.
function pick(products, category, position, color) {
  let count = 0;
  for (const p of products) {
    if (p.category === category) {
      if (count === position) {
        return p;
      }
      count++;
    }
  }
  return { name: category, type: "shirt", color: color, imageUrl: "" };
}

export default function Home() {
  const { products, loading, error, retry } = useProducts();
  const navigate = useNavigate();

  // Show the 4 best rated products. Sorting is done with a simple copy + sort.
  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const heroPics = [
    pick(products, "Men", 0, "#eab308"),
    pick(products, "Kids", 0, "#7f1d1d"),
    pick(products, "Men", 1, "#1e40af"),
    pick(products, "Kids", 1, "#cbd5e1"),
  ];
  const menPic = pick(products, "Men", 2, "#f472b6");
  const kidsPic = pick(products, "Kids", 2, "#f59e0b");

  function openProduct() {
    navigate("/products");
  }

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="eyebrow">New season · Men & Kids</span>
            <h1>Everyday clothing, made simple.</h1>
            <p>
              Smart shirts for men and fun, comfortable shirts and tees for boys.
              Choose what you like, place your order, and we take care of the rest.
            </p>
            <div className="hero-actions">
              <Link to="/products?cat=Men" className="btn btn-primary">Shop Men</Link>
              <Link to="/products?cat=Kids" className="btn btn-light">Shop Kids</Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-tile t1"><ProductImage product={heroPics[0]} /></div>
            <div className="hero-tile t2"><ProductImage product={heroPics[1]} /></div>
            <div className="hero-tile t3"><ProductImage product={heroPics[2]} /></div>
            <div className="hero-tile t4"><ProductImage product={heroPics[3]} /></div>
          </div>
        </div>
      </section>

      {/* ---------- Trust strip ---------- */}
      <section className="trust">
        <div className="container trust-inner">
          {TRUST.map((t) => (
            <div className="trust-item" key={t.title}>
              <span className="trust-icon" aria-hidden="true">✓</span>
              <div>
                <div className="trust-title">{t.title}</div>
                <div className="muted small">{t.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by category</h2>
          <div className="category-grid">
            <Link to="/products?cat=Men" className="category-card men">
              <div>
                <div className="category-name">Men</div>
                <div className="category-sub">Casual, linen and formal shirts</div>
                <span className="link-arrow">Shop men →</span>
              </div>
              <div className="category-art"><ProductImage product={menPic} /></div>
            </Link>
            <Link to="/products?cat=Kids" className="category-card kids">
              <div>
                <div className="category-name">Kids</div>
                <div className="category-sub">Boys' shirts and t-shirts</div>
                <span className="link-arrow">Shop kids →</span>
              </div>
              <div className="category-art"><ProductImage product={kidsPic} /></div>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Top rated this season</h2>
            <Link to="/products" className="link-arrow">View all products →</Link>
          </div>
          {loading && <Loading text="Loading products..." />}
          {error && <ErrorBox message={error} onRetry={retry} />}
          {!loading && !error && (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={openProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">How ordering works</h2>
          <div className="how-grid">
            {STEPS.map((s, i) => (
              <div className="how-card" key={s.title}>
                <span className="how-number">{i + 1}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
