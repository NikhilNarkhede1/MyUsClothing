import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Shipping from "./pages/Shipping.jsx";
import Account from "./pages/Account.jsx";
import StoreInfo from "./pages/StoreInfo.jsx";

// The 4 pages of the shop:
//   /          Home
//   /products  Products (with product details window)
//   /order     Order Details (what is in your order)
//   /shipping  Shipping details + Place Order button
export default function App() {
  const location = useLocation();

  // Start every page at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/order" element={<OrderDetails />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/login" element={<Account />} />
          <Route path="/register" element={<Account />} />
          <Route path="/about" element={<StoreInfo />} />
          <Route path="/contact" element={<StoreInfo />} />
          <Route path="/terms" element={<StoreInfo />} />
          <Route path="/returns-refunds" element={<StoreInfo />} />
          <Route path="/privacy" element={<StoreInfo />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
