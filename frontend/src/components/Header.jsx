import { Link, NavLink } from "react-router-dom";
import { useCart } from "../CartContext.jsx";

export default function Header() {
  const cart = useCart();

  function linkClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="MyUsClothing home">
          <span className="brand-mark">
            <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
              <path d="M11 7l-6 4 2 5 3-1v10h10V15l3 1 2-5-6-4c-1 2-3 3-5 3s-4-1-5-3z" fill="#fff" />
            </svg>
          </span>
          <span className="brand-name">MyUsClothing</span>
        </Link>

        <nav className="main-nav" aria-label="Main">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          <NavLink to="/order" className={linkClass}>
            Order Details
            {cart.count > 0 && <span className="badge">{cart.count}</span>}
          </NavLink>
          <NavLink to="/login" className={linkClass}>Login / Register</NavLink>
        </nav>
      </div>
    </header>
  );
}
