# 🛍 Clothing E-Commerce – Full Stack Application (MERN + TypeScript)

A complete online clothing shopping application built using React (Vite + TypeScript), Node.js + Express + TypeScript, MongoDB, TailwindCSS, JWT Authentication, and Email Notifications.

## 📸 Screenshots

![Login](https://media.licdn.com/dms/image/v2/D5622AQHPyzvO0pH31Q/feedshare-shrink_2048_1536/B56ZravwYwIYAk-/0/1764606543661?e=1766016000&v=beta&t=CQGfTNSKl-f6aRUnG9vG9gifxlrNy5jQsmrkyBEm3Cw)

![Home](https://media.licdn.com/dms/image/v2/D5622AQHfiOGQcnPJWg/feedshare-shrink_2048_1536/B56ZravwonJsAk-/0/1764606544685?e=1766016000&v=beta&t=3aeOZ-HNwsZ-amGzUTlbr38PBAOtOkVD-jSI2VgOuWE)


![Product-Detail](https://media.licdn.com/dms/image/v2/D5622AQEKOqiJk4h4Fw/feedshare-shrink_2048_1536/B56ZravwpDK4Ak-/0/1764606544757?e=1766016000&v=beta&t=5p4CGMpRFbfyc0hhyY20B5xRw7NCswHy4x1qNnTrE18)

![Cart](https://media.licdn.com/dms/image/v2/D5622AQGm3hPevtlKng/feedshare-shrink_2048_1536/B56ZravwcFG4As-/0/1764606543866?e=1766016000&v=beta&t=o6Jv0sTHz-j3g02R97AHT3NxOcUDGUuIMIVBQAYCfiA)


![checkout](https://media.licdn.com/dms/image/v2/D5622AQFabUtdQ33bgw/feedshare-shrink_2048_1536/B56ZravwcIKwAk-/0/1764606543887?e=1766016000&v=beta&t=1N-HGZe1-Djro6_82d1kAHImbZe3ExiO0-tRZvnu7Hw)


✨ Features

- 👕 Product listing with filter/search
- 📄 Product details page

- 🔐 JWT authentication for login/register

- 🛒 Cart with quantity update

- 📦 Order placement

- 📧 Email order confirmation

- 🧾 Order history

- 🎨 Fully responsive UI using TailwindCSS

- ⚙ Fully typed backend with TypeScript


📁 Folder Structure
```
clothing-ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── seedProducts.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── CartItem.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── OrderSuccess.jsx
│   │   ├── services/
│   │   │   └── api.js (axios instance)
│   │   ├── App.jsx
│   │   └── index.css
│
└── README.md (with setup instructions)
```
🚀 Project Setup
1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/clothing-ecommerce.git
cd clothing-ecommerce
```
🖥 Frontend Setup (React + Vite + TS)
```bash
cd frontend
npm install
npm run dev
touch .env
# IN Frontend .env
VITE_API_URL=http://localhost:5000/api
```
🛠 Backend Setup (Node.js + Express + TS)
```basg
cd backend
npm install
npm run dev
````

In Backend.env

```bash
#  .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/clothing-ecommerce
JWT_SECRET=supersecretkey
JWT_EXPIRE=7d
EMAIL_USER=yourEmail@gmail.com
EMAIL_PASS=yourAppPassword
CLIENT_URL=http://localhost:5173
```
🌱 Seed the Database
npm run seed


Adds sample products.

🏗 Production Build
Frontend:
```bash
cd frontend
npm run build
```
Backend:
```bash
cd backend
npm run build
npm start

```

## 📘 API Documentation

AUTH ROUTES

| Method | Endpoint           | Description        |
| :----- | :----------------- | :----------------- |
| POST   | /api/auth/register | Register user      |
| POST   | /api/auth/login    | Login user         |
| GET    | /api/auth/me       | Get logged-in user |


PRODUCT ROUTES


| Method |     Endpoint      |         Description |
| :----- | :---------------: | ------------------: |
| GET    |   /api/products   |    Get all products |
| GET    | /api/products/:id | Get product details |

CART ROUTES
| Method | Endpoint         | Description     |
| :----- | :--------------- | :-------------- |
| GET    | /api/cart        | Get user cart   |
| POST   | /api/cart/add    | Add product     |
| PUT    | /api/cart/update | Update quantity |
| DELETE | /api/cart/remove | Remove item     |

|ORDER ROUTES|
| Method | Endpoint       | Description      |
| :----- | :------------- | :--------------- |
| POST   | /api/orders    | Place order      |
| GET    | /api/orders/my | View user orders |

```yaml
openapi: 3.0.0
info:
  title: Clothing Ecommerce API
  version: 1.0.0

servers:
  - url: http://localhost:5000/api


paths:

  /auth/register:
    post:
      summary: Register a new user
      responses:
        '201': { description: User registered }

  /auth/login:
    post:
      summary: Login user
      responses:
        '200': { description: Logged in }

  /auth/me:
    get:
      summary: Get logged-in user
      security: [ { bearerAuth: [] } ]
      responses:
        '200': { description: User details }

  /products:
    get:
      summary: Get all products
      responses:
        '200': { description: Product list }

  /products/{id}:
    get:
      summary: Get one product
      parameters:
        - in: path
          name: id
          required: true
      responses:
        '200': { description: Product detail }

  /cart:
    get:
      summary: Get cart
      security: [ { bearerAuth: [] } ]
      responses:
        '200': { description: Cart data }

  /cart/add:
    post:
      summary: Add product to cart
      security: [ { bearerAuth: [] } ]
      responses:
        '201': { description: Added }

  /cart/update:
    put:
      summary: Update cart item
      security: [ { bearerAuth: [] } ]
      responses:
        '200': { description: Updated }

  /cart/remove:
    delete:
      summary: Remove cart item
      security: [ { bearerAuth: [] } ]
      responses:
        '200': { description: Removed }

  /orders:
    post:
      summary: Place order
      security: [ { bearerAuth: [] } ]
      responses:
        '201': { description: Order placed }

  /orders/my:
    get:
      summary: Get user orders
      security: [ { bearerAuth: [] } ]
      responses:
        '200': { description: Orders list }

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```
📬 Email Workflow

When user places an order

Email is sent using Nodemailer

Includes order ID, total, and item summary

🐞 Troubleshooting
🔥 Backend cannot import .ts files

Enable in tsconfig.json:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": false
  }
}
```

⭐ Support

If this project helped you, please ⭐ star the repo!
