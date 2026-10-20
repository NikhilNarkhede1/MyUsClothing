// All calls to the Spring Boot backend live here.
// "/api/..." is forwarded to http://localhost:8080 by vite.config.js

async function request(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (e) {
    throw new Error("Cannot reach the server. Please check that the backend is running.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // response had no JSON body
  }

  if (!response.ok) {
    if (data && data.message) {
      throw new Error(data.message);
    }
    throw new Error("Something went wrong (error " + response.status + ")");
  }
  return data;
}

const API_BASE_URL = "https://myusclothing.onrender.com";

export function getProducts() {
  return request(`${API_BASE_URL}/api/products`);
}

export function placeOrder(order) {
  return  request(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
}
