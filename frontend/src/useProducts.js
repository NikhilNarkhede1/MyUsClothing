import { useEffect, useState } from "react";
import { getProducts } from "./api.js";

// Loads the product list from the backend.
// Returns { products, loading, error, retry }.
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return { products, loading, error, retry: () => setAttempt(attempt + 1) };
}
