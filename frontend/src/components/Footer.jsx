import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  ["About Us", "/about"],
  ["Contact Us", "/contact"],
  ["Terms & Conditions", "/terms"],
  ["Returns & Refunds", "/returns-refunds"],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner footer-columns">
        <div>
          <div className="footer-brand">MyUsClothing</div>
          <p className="footer-text">Everyday apparel for men and kids, with simple ordering and clear information about delivery, returns, and customer support.</p>
          <p className="footer-text">For help with an order, please use the Contact Us page and include your order number. Never share your card PIN, CVV, or OTP.</p>
        </div>
        <div>
          <div className="footer-title">CUSTOMER INFORMATION</div>
          {FOOTER_LINKS.map(([label, href]) => (
            <Link key={label} to={href}>{label}</Link>
          ))}
        </div>
        <div>
          <div className="footer-title">SHOP WITH CONFIDENCE</div>
          <p className="footer-text">Review product details and size information before ordering. Delivery charges, where applicable, are shown in your order summary before you place an order.</p>
          <p className="footer-text">Returns are subject to the eligibility conditions described in our Returns &amp; Refunds policy.</p>
        </div>
      </div>
      <div className="footer-bottom"><div className="container">© {new Date().getFullYear()} MyUsClothing. All rights reserved.</div></div>
    </footer>
  );
}
