# Store Rating System - Frontend

React.js frontend for the Store Rating System with modern UI and dark mode support.

## Features

- Modern SaaS dashboard aesthetic
- Dark mode toggle
- Responsive design (mobile-first)
- Role-based dashboards
- Real-time data fetching with TanStack Query
- Form validation with React Hook Form
- Smooth animations with Framer Motion
- Toast notifications with React Hot Toast
- Protected routes with role checking
- Auto token refresh

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Running the App

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Pages

### Public
- `/login` - User login
- `/signup` - User registration

### Protected
- `/dashboard` - Role-based dashboard
- `/stores` - Store listing
- `/stores/:id` - Store details with ratings
- `/users` - User management (Admin only)
- `/ratings` - Ratings listing (Admin/Store Owner)
- `/settings` - User settings
- `/change-password` - Password change
- `/unauthorized` - Access denied
- `/*` - 404 page

## Components

### Layout
- `MainLayout` - Main layout with conditional navbar
- `Navbar` - Responsive navigation with dark mode toggle

### Context
- `AuthProvider` - Authentication context and state
- `ThemeContext` - Dark mode theme context

### Utilities
- `ProtectedRoute` - Route protection with role checking

## Services

API service layer using Axios:

- `api.js` - Axios instance with interceptors
- `authService.js` - Authentication API calls
- `userService.js` - User CRUD API calls
- `storeService.js` - Store CRUD API calls
- `ratingService.js` - Rating CRUD API calls
- `dashboardService.js` - Dashboard API calls

## Tech Stack

- React 18
- React Router DOM
- TanStack Query
- Axios
- Tailwind CSS
- React Hook Form
- Framer Motion
- React Icons
- React Hot Toast
- Vite

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── layouts/
│   └── MainLayout.jsx
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Stores.jsx
│   ├── StoreDetails.jsx
│   ├── Users.jsx
│   ├── Ratings.jsx
│   ├── Settings.jsx
│   ├── ChangePassword.jsx
│   ├── Unauthorized.jsx
│   └── NotFound.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── userService.js
│   ├── storeService.js
│   ├── ratingService.js
│   └── dashboardService.js
├── App.jsx
├── main.jsx
└── index.css
```

## Features by Role

### Admin
- View all users
- Create/edit/delete users
- View all stores
- Create/edit/delete stores
- View all ratings
- Admin dashboard with analytics

### Store Owner
- View own stores
- Create/edit own stores
- View store ratings
- Store owner dashboard with performance metrics

### User
- View all stores
- Rate stores (once per store)
- View own ratings
- User dashboard with rating history

## Styling

The app uses Tailwind CSS with a custom color palette:

- Primary: Blue (#3b82f6)
- Dark mode support via `class` strategy
- Inter font family
- Rounded corners, soft shadows
- Generous spacing
