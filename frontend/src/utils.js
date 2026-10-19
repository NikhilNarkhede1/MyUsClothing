// Small helper functions used on many pages.

// Shipping rules. The server uses the same rules and is the final authority.
export const FREE_SHIPPING_ABOVE = 1499;
export const SHIPPING_FEE = 99;

// 1499 -> "₹1,499"
export function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// Percentage saved, e.g. price 399, mrp 999 -> 60
export function discountPercent(price, mrp) {
  if (!mrp || mrp <= price) {
    return 0;
  }
  return Math.round(((mrp - price) / mrp) * 100);
}

export function shippingFor(subtotal) {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_ABOVE) {
    return 0;
  }
  return SHIPPING_FEE;
}

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];
