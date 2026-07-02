# Store Rating System

A full-stack enterprise-grade store rating application with role-based access control, built with React, Express, Prisma, and MySQL.

## Features

- **User Authentication**: JWT-based auth with refresh tokens, secure password hashing
- **Role-Based Access Control (RBAC)**: Admin, Store Owner, and User roles with specific permissions
- **Store Management**: Create, read, update, delete stores with owner associations
- **Rating System**: Users can rate stores (1-5 stars), one rating per user per store
- **Dashboards**: Role-specific dashboards with analytics and statistics
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS
- **Real-time Updates**: Using TanStack Query for efficient data fetching
- **Input Validation**: Comprehensive validation on both frontend and backend

## Tech Stack

### Frontend
- React.js 18
- React Router DOM
- TanStack Query
- Axios
- Tailwind CSS
- React Hook Form
- Framer Motion
- React Icons
- React Hot Toast
- Vite

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- bcrypt
- express-validator
- Helmet
- CORS
- Morgan

## Project Structure

```
RateStore/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .gitignore
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database configuration:
```env
DATABASE_URL="mysql://username:password@localhost:3306/store_rating_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database (optional)
npx prisma db seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` if needed (default is `http://localhost:5000`):
```env
VITE_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Test Accounts

After seeding the database, you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ratestore.com | Admin@123 |
| Store Owner | owner1@ratestore.com | Owner@123 |
| User | user1@ratestore.com | User@123 |

## API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user

### User Endpoints (Admin only)

- `GET /api/users` - List all users (with pagination, search, role filter)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Store Endpoints

- `GET /api/stores` - List all stores (with pagination, search)
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create new store (Admin/Store Owner)
- `PUT /api/stores/:id` - Update store (Admin/Store Owner)
- `DELETE /api/stores/:id` - Delete store (Admin only)

### Rating Endpoints

- `GET /api/ratings` - List all ratings (Admin only)
- `GET /api/ratings/:id` - Get rating by ID
- `GET /api/ratings/store/:storeId` - Get ratings for a specific store
- `POST /api/ratings` - Create new rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating (Admin/User)

### Dashboard Endpoints

- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/store-owner` - Store owner dashboard data
- `GET /api/dashboard/user` - User dashboard data

## Validation Rules

- **Full Name**: 20-60 characters
- **Address**: Maximum 400 characters
- **Password**: 8-16 characters, at least 1 uppercase, 1 number, 1 special character
- **Email**: RFC-compliant email format
- **Rating**: Integer between 1 and 5

## Security Features

- JWT authentication with access and refresh tokens
- Password hashing with bcrypt (10 salt rounds)
- Helmet for secure HTTP headers
- CORS configuration
- Input sanitization via express-validator
- SQL injection prevention via Prisma parameterization
- Role-based access control enforced at middleware level

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy automatically on push

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Database (Railway MySQL)

1. Create a MySQL instance on Railway
2. Get connection string
3. Update `DATABASE_URL` in backend environment variables
4. Run migrations: `npx prisma migrate deploy`

## Development

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Code Style

The project uses ESLint for code linting. Run:

```bash
npm run lint
```

## License

ISC

## Support

For issues and questions, please open an issue on the GitHub repository.
