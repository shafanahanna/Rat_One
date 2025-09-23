# Upcline HR Management System - Backend

This is the backend API for the Upcline HR Management System, built with NestJS and PostgreSQL.

## Features

- RESTful API endpoints for HR management
- JWT-based authentication and authorization
- Role-based access control
- Database integration with TypeORM
- File uploads with Cloudinary integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Rat_One/backend

# Install dependencies
npm install
# or
yarn install
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
NODE_ENV=development
PORT=2222
PG_USER=your_db_user
PG_HOST=localhost
PG_DATABASE=your_db_name
PG_PASSWORD=your_db_password
PG_PORT=5432
PG_SSL=false

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Development

```bash
# Start development server
npm run start:dev
# or
yarn start:dev
```

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build

# Start production server
npm run start:prod
# or
yarn start:prod
```

## API Documentation

API endpoints are available at `/api` when the server is running.

## Technologies Used

- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Cloudinary
- Class Validator
