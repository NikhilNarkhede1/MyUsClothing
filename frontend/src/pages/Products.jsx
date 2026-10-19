import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import ProductModal from "../components/ProductModal.jsx";
import { ErrorBox, Loading } from "../components/Status.jsx";
import { useCart } from "../CartContext.jsx";
import { useProducts } from "../useProducts.js";

const TABS = ["All", "Men", "Kids"];

export default function Products() {
  const { products, loading, error, retry } = useProducts();
  const cart = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState(null);   // product open in the details window
  const [added, setAdded] = useState("");           // name of the product just added

  // The category is kept in the web address (?cat=Men) so links from Home work.
  let category = searchParams.get("cat");
  if (category !== "Men" && category !== "Kids") {
    category = "All";
  }

  function chooseCategory(tab) {
    if (tab === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ cat: tab });
    }
  }

  // 1) filter
  let shown = [];
  for (const p of products) {
    if (category === "All" || p.category === category) {
      shown.push(p);
    }
  }

  // 2) sort
  if (sort === "low") {
    shown.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    shown.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    shown.sort((a, b) => b.rating - a.rating);
  }

  // Hide the "added" message by itself after 4 seconds
  useEffect(() => {
    if (added === "") {
      return;
    }
    const timer = setTimeout(() => setAdded(""), 4000);
    return () => clearTimeout(timer);
  }, [added]);

  function handleAdd(product, size, quantity) {
    cart.addItem(product, size, quantity);
    setSelected(null);
    setAdded(product.name);
  }

  function countFor(tab) {
    if (tab === "All") return products.length;
    let n = 0;
    for (const p of products) {
      if (p.category === tab) n++;
    }
    return n;
  }

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{category === "All" ? "All products" : category + "'s wear"}</h1>
          <div className="muted">{shown.length} products</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={category === tab}
              className={category === tab ? "tab active" : "tab"}
              onClick={() => chooseCategory(tab)}
            >
              {tab}
              {!loading && !error && <span className="tab-count">{countFor(tab)}</span>}
            </button>
          ))}
        </div>

        <label className="sort">
          <span className="muted">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      {loading && <Loading text="Loading products..." />}
      {error && <ErrorBox message={error} onRetry={retry} />}

      {!loading && !error && (
        <div className="product-grid">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={handleAdd} />
      )}

      {added && !selected && (
        <div className="toast" role="status">
          <span><b>{added}</b> added to your order</span>
          <Link to="/order" className="toast-link">View order</Link>
          <button className="toast-close" onClick={() => setAdded("")} aria-label="Dismiss">×</button>
        </div>
      )}
    </div>
  );
}
