# Dent App API (Backend)

Production-ready REST API for a dentistry learning platform. The backend is built with **TypeScript + Express**, uses **MongoDB** for persistence, and provides authentication (JWT + Google OAuth), quizzes, and user management endpoints. The project is structured with clear configuration, validation, logging, and testing to be portfolio-ready.

## ✨ Features

- RESTful endpoints for users, quizzes, and questions
- JWT authentication with refresh tokens
- Google OAuth 2.0 sign-in
- Request validation with Zod
- Centralized error handling and structured logging
- Swagger/OpenAPI docs
- Dockerized API + MongoDB
- Unit and e2e tests with Jest + Supertest

## 🧰 Tech Stack

- **Node.js**, **TypeScript**, **Express**
- **MongoDB + Mongoose**
- **JWT**, **Passport.js**
- **Zod** for validation
- **Winston** for logging
- **Jest**, **Supertest**

## ✅ Getting Started (Local)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API will be available at `http://localhost:3555`  
Swagger docs: `http://localhost:3555/docs`

## 🐳 Run with Docker

```bash
cd backend
cp .env.example .env
docker compose up --build
```

## 📬 API Examples

### Health Check

```bash
curl http://localhost:3555/
```

### Sign Up

```bash
curl -X POST http://localhost:3555/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@example.com","password":"password123","passwordConfirm":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3555/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'
```

## 📂 Backend Structure (high level)

```
backend/
  src/
    config/        # app + env config
    controllers/   # route handlers
    middleware/    # auth + validation
    routes/        # route definitions
    services/      # domain services
    utils/         # helpers (JWT, email, etc.)
    validation/    # Zod request schemas
    errorHandler/  # centralized error handling
```

## 🧪 Testing

```bash
cd backend
npm test
```

## 📝 Notes

- The backend currently uses **MongoDB** to avoid breaking existing functionality. If you want a PostgreSQL version, treat it as a separate migration task.
