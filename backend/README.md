# Store Rating System - Backend

Express.js backend API for the Store Rating System with Prisma ORM and MySQL.

## Features

- RESTful API architecture
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Input validation with express-validator
- Password hashing with bcrypt
- Prisma ORM for database operations
- Security middleware (Helmet, CORS)
- Request logging with Morgan

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="mysql://username:password@localhost:3306/store_rating_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development"
FRONTEND_URL="http://localhost:5173"
```

## Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh token
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Stores
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Get store
- `POST /api/stores` - Create store (Admin/Store Owner)
- `PUT /api/stores/:id` - Update store (Admin/Store Owner)
- `DELETE /api/stores/:id` - Delete store (Admin)

### Ratings
- `GET /api/ratings` - List ratings (Admin)
- `GET /api/ratings/:id` - Get rating
- `GET /api/ratings/store/:storeId` - Get store ratings
- `POST /api/ratings` - Create rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating (Admin/User)

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard
- `GET /api/dashboard/store-owner` - Store owner dashboard
- `GET /api/dashboard/user` - User dashboard

## Project Structure

```
src/
├── config/
│   └── database.js       # Prisma client configuration
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── storeController.js
│   ├── ratingController.js
│   └── dashboardController.js
├── middleware/
│   └── auth.js           # Authentication & authorization
├── routes/
│   ├── auth.js
│   ├── user.js
│   ├── store.js
│   ├── rating.js
│   └── dashboard.js
├── utils/
│   ├── jwt.js            # JWT utilities
│   └── password.js       # Password hashing
├── validators/
│   ├── auth.js
│   ├── user.js
│   ├── store.js
│   └── rating.js
├── app.js                # Express app configuration
└── server.js             # Server entry point
```

## Security

- JWT tokens for authentication
- bcrypt for password hashing
- Helmet for secure headers
- CORS configuration
- Input validation
- SQL injection prevention (Prisma)
