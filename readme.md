# Dukan - Photography Marketplace Platform

> 🚧 **Work in Progress** - This project is actively under development

A platform connecting photographers with clients. Users can discover, book, and review photographers for their events and creative needs.

## Overview

**Dukan** is a full-stack marketplace application designed to help users find and hire professional photographers. Photographers can create profiles, showcase their portfolios, manage bookings, and build their reputation through client reviews.

## Features (In Development)

### For Users (Clients)
- [ ] Browse photographers by location and specialty
- [ ] View photographer profiles and portfolios
- [ ] Book photography sessions
- [ ] Leave reviews and ratings
- [ ] Search functionality with filters

### For Photographers
- [ ] Create and manage photographer profiles
- [ ] Upload and showcase portfolio images
- [ ] Manage bookings and availability
- [ ] Receive reviews from clients
- [ ] Set pricing information

### Admin Features
- [ ] User management
- [ ] Photographer verification
- [ ] Content moderation
- [ ] Platform analytics

## Project Structure

```
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database models (Mongoose)
│   │   ├── routes/         # API route definitions
│   │   ├── middlewares/    # Express middlewares
│   │   ├── validations/    # Zod validation schemas
│   │   ├── utils/          # Utility functions
│   │   ├── db/             # Database connection
│   │   └── app.ts          # Express app entry point
│   └── package.json
└── [frontend/]      # (Coming Soon) Frontend application
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (Access & Refresh tokens)
- **Validation**: Zod
- **File Uploads**: Multer + Cloudinary
- **Security**: Helmet, CORS, Rate Limiting

### Frontend (Planned)
- *To be determined*

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB database
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=3001
   ORIGIN_HOSTS=http://localhost:5173
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_secret
   ACCESS_TOKEN_EXPIRY=6h
   REFRESH_TOKEN_SECRET=your_refresh_secret
   REFRESH_TOKEN_EXPIRY=10d
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Database
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=dukan
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Documentation

### Base URL
```
/api/v1
```

### Available Endpoints

| Resource | Description |
|----------|-------------|
| `/api/v1/users` | User authentication & management |
| `/api/v1/photographers` | Photographer profiles |
| `/api/v1/portfolio` | Portfolio management |
| `/api/v1/bookings` | Booking management |
| `/api/v1/reviews` | Reviews & ratings |

*Detailed API documentation coming soon*

## Development Status

- ✅ Database schema design
- ✅ Express server setup
- ✅ Authentication system
- ✅ Photographer profile management
- ✅ Portfolio image uploads (Cloudinary)
- ✅ Booking system
- ✅ Review system
- 🔄 Frontend development (pending)
- 🔄 Search & filtering optimization (pending)
- 🔄 Payment integration (planned)
- 🔄 Real-time notifications (planned)

## Contributing

This is a personal project currently in development. Contributions may be accepted in the future.

## License

ISC

---

*Built with ❤️ for photographers and their clients*
