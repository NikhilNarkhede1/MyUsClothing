# MyUsClothing - Apparel Shop (Men & Kids)

A clean, simple online clothing shop. **React** (frontend) + **Spring Boot** (backend).

## What it does
- **12 products**: 6 Men + 6 Kids
- Pages: Home, Products, Order Details, Shipping checkout, Login/Register
- Product details open in a window (pick size and quantity)
- Demo login/register screens (browser-only; not secure production authentication)\n- No online payment gateway
- On the Shipping page, **Place Order** books the order and **emails the customer** the order details and a request for payment details
- Free shipping on orders of Rs 1,499 or more, otherwise Rs 99

## Products and photos
The shop has 12 products (6 men's shirts, 6 boys' shirts and t-shirts), each with a photo.
- Photos live in `frontend/public/images/products/`. The file name comes from the product name
  (`Men Oxford Button-Down Shirt` -> `men-oxford-button-down-shirt.jpg`). The full list is in that folder's `README.txt`.
- To change a photo, replace the file (same name) and refresh the browser.
- To change products, names, prices or sizes, edit the list in `backend/src/main/java/com/shop/DataLoader.java`
  and restart the backend. The database is updated automatically on start, so you do not need to delete `backend/data`.
- A product whose photo file is missing shows a simple drawing instead.

## Install first
- Java 17+, Maven, Node.js 18+  (no MySQL needed: data is stored in a small H2 file database)

## Run it

**1. Backend** (http://localhost:8080)
```bash
cd backend
mvn spring-boot:run
```

**2. Frontend** (second terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Fix order emails (Gmail example)
Until you do this, orders still work, but the email is only printed in the backend console
and the confirmation page says the email could not be sent.

1. In your Google account turn on **2-Step Verification**.
2. Create an **App Password**: Google Account > Security > App passwords (16 letters).
3. Open a terminal in the `backend` folder and run these commands in the SAME PowerShell terminal. Replace the sample values with your Gmail address and the 16-character Google App Password (remove spaces):

Windows (PowerShell):
```powershell
$env:MAIL_USERNAME="yourname@gmail.com"
$env:MAIL_PASSWORD="abcdefghijklmnop"
mvn spring-boot:run
```

Keep that terminal open while testing. If you start the backend from a different terminal or VS Code Run button, those variables may not be available to it. The backend log says whether sending succeeded or failed. Check the Spam folder too.
Mac / Linux:
```bash
MAIL_USERNAME=yourname@gmail.com MAIL_PASSWORD=your16letterapppassword mvn spring-boot:run
```
(In IntelliJ: Run > Edit Configurations > Environment variables.)

Other providers: also set `MAIL_HOST` and `MAIL_PORT`.
Never write your real password into the code or upload it to GitHub.

## How it fits together
```
Browser (React) --/api--> Controller --> Service --> Repository --> H2 database
                                          |
                                          +--> EmailService --> customer's inbox
```

```
backend/src/main/java/com/shop/
  DataLoader.java        adds the 12 products on first start
  model/                 Product, Order, OrderItem   (database tables)
  repository/            ProductRepository, OrderRepository
  dto/                   OrderRequest, OrderResponse (data in / out of the API)
  service/OrderService   checks the form, calculates prices, saves the order
  service/EmailService   builds and sends the email
  controller/            GET /api/products   POST /api/orders

frontend/src/
  pages/        Home, Products, OrderDetails, Shipping
  components/   Header, Footer, ProductCard, ProductModal, Stepper, Garment (clothing drawings)
  CartContext   the order list, saved in the browser
```

## Good to know
- Prices are **never trusted from the browser**: the server reads real prices from the database.
- A failed email never cancels an order. If the confirmation page says the email was not sent, check the backend console for the SMTP error and confirm that MAIL_USERNAME and MAIL_PASSWORD are set in the terminal that starts Spring Boot.
- Login/register in this starter version is only a browser demo. It stores account details in localStorage and is not suitable for real customer accounts. Add server-side authentication and password hashing before production.
- The footer's Company/More Info URLs are the reference links requested for the footer; replace them with MyUsClothing-owned pages before publishing if they are not your pages.
- To change products: edit `DataLoader.java`, delete the folder `backend/data`, restart.
- Run the backend tests: `cd backend && mvn test`
