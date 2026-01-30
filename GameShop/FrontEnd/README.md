# GameShop Frontend

A modern React frontend for the GameShop application built with Vite.

## Features

- **Authentication**: JWT token-based login
- **Games Management**: Browse and purchase games with a shopping cart
- **User Management**: Admin can view all users
- **Profile Management**: Users can view and edit their profiles
- **Product Browsing**: View platforms, genres, companies, and tags
- **Order Management**: Create and manage orders
- **Admin Dashboard**: Admin-only features for managing statuses and users

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: React Hooks & Context API
- **HTTP Client**: Fetch API
- **Styling**: CSS Modules + Global CSS

## Theme

Dark blue theme with modern UI components and responsive design.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the FrontEnd directory:
   ```bash
   cd FrontEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional, API URL is hardcoded in config.ts):
   ```
   VITE_API_URL=https://localhost:5000
   ```

### Running the Development Server

```bash
npm run dev
```

The application will open at `https://localhost:3000`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
├── context/            # Context API providers (Auth, Cart)
├── entities/           # TypeScript interfaces
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service functions
├── styles/             # Global CSS styles
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Authentication

The app uses JWT token-based authentication:
- Login endpoint: `POST /api/Auth`
- Tokens are stored in localStorage
- All API requests include the Authorization header

### Demo Credentials

- Username: `admin`
- Password: `admin`

## API Configuration

The API base URL is configured in `src/config.ts`:

```typescript
export const API_BASE_URL = "https://localhost:5000";
```

## Features by Role

### Regular Users
- View and search games
- Add games to cart and create orders
- View their own orders
- Edit and delete their profile
- Browse platforms, genres, companies, and tags

### Administrators
- All user features
- Manage all users
- View all orders
- Manage statuses
- Edit and delete products (games, platforms, genres, companies, tags)

## Notes

- Status colors: Pending (Orange), Completed (Green), Cancelled (Red)
- Shopping cart is stored in React context (frontend only)
- Responsive design works on mobile, tablet, and desktop
- All forms have validation and error handling
