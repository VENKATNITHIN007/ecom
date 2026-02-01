# 🛒 E-Commerce Backend (Express.js)

A scalable and secure e-commerce backend built with **Node.js**, **Express**, and **MongoDB**.  
This API handles authentication, product management, orders, payments, and admin operations.

---

## 🚀 Features

- User authentication & authorization (JWT)
- Role-based access control (Admin / User)
- Product & category management
- Cart & order management
- Payment integration (Stripe / Razorpay / etc.)
- Secure password hashing (bcrypt)
- RESTful API structure
- Environment-based configuration
- Error handling & validation
- Pagination, filtering & search

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcrypt**
- **dotenv**
- **Stripe / Razorpay (optional)**

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
## Server Data
###############
PORT=3001
ORIGIN_HOSTS=http://localhost:5173
APP_DEBUG=false

## Access token
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
## Refresh Token
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

##############
## Cloudinnary
###############
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

##############
## Database
###############
MONGO_URI=mongodb://localhost:27017
DB_NAME=
