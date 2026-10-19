import ProductImage from "./ProductImage.jsx";
import { discountPercent, formatPrice } from "../utils.js";

export default function ProductCard({ product, onOpen }) {
  const off = discountPercent(product.price, product.mrp);

  return (
    <article className="card product-card">
      <button className="card-hit" onClick={() => onOpen(product)} aria-label={"View " + product.name}>
        <ProductImage product={product} />
        <span className="tag-category">{product.category}</span>
        <div className="card-body">
          <div className="brand-line">{product.brand}</div>
          <h3 className="product-name">{product.name}</h3>
          <div className="price-row">
            <span className="price">{formatPrice(product.price)}</span>
            <span className="mrp">{formatPrice(product.mrp)}</span>
            {off > 0 && <span className="off">{off}% off</span>}
          </div>
          <div className="rating">★ {product.rating.toFixed(1)}</div>
        </div>
      </button>
    </article>
  );
}
