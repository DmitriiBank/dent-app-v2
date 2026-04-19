# Dent App

Full-stack educational quiz platform for dentistry topics. The project consists of a TypeScript/Express/MongoDB backend and a React/Vite frontend.

The current codebase supports:
- authentication with email/password and Google OAuth
- role-based access for `user`, `teacher`, and `admin`
- quiz passing and result storage
- unlimited quiz retakes for teachers and admins
- admin CRUD for users, quizzes, and quiz questions
- question images by URL, local path, or uploaded file encoded as `data:image`
- audit logging for admin CRUD actions

## Project Structure

```text
quiz-app/
  backend/   Express + TypeScript + MongoDB API
  frontend/  React + Vite client
```

## Tech Stack

- Backend: Node.js, TypeScript, Express, MongoDB, Mongoose, Zod, Passport, JWT, Winston, Jest
- Frontend: React 19, TypeScript, Vite, Redux Toolkit, React Router, MUI

## Roles

- `user`: can log in, take quizzes once, and view personal results
- `teacher`: can browse student results and retake quizzes without limit
- `admin`: can manage users, quizzes, questions, and view audit logs

## Local Development

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment

Backend requires a `.env` file in `backend/`.

Minimum required variables:

```env
NODE_ENV=development
PORT=3555
DATABASE=mongodb://localhost:27017/dent_app
JWT_ACCESS_SECRET=replace-with-a-secure-secret
JWT_REFRESH_SECRET=replace-with-another-secure-secret
JWT_EXPIRES_IN=90d
SERVER_URL=http://localhost:3555
GOOGLE_CLIENT_URL=http://localhost:5173
```

Optional email/OAuth variables:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_FROM=
LOG_LEVEL=info
```

Frontend optionally supports a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3555
```

If `VITE_API_BASE_URL` is omitted, the frontend defaults to `http://localhost:3555`.

### 3. Start services

Backend:

```bash
cd backend
npm run start:dev
```

Frontend:

```bash
cd frontend
npm run start-dev
```

Open the app at `http://localhost:5173`.

## Main Routes

Frontend routes:

- `/quizzes`
- `/quizzes/:quizId`
- `/quizzes/:quizId/results`
- `/users/login`
- `/users/signup`
- `/users/me`
- `/teacher/results`
- `/admin/users`
- `/admin/content`
- `/lectures`
- `/anatomy`

Backend API base:

- `http://localhost:3555/api/v1`

Swagger/OpenAPI UI:

- `http://localhost:3555/docs`

## Backend Capabilities

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/forgotPassword`
- `POST /api/v1/auth/resetPassword/:token`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/updateMe`
- `PATCH /api/v1/users/updatePassword`
- `DELETE /api/v1/users/deleteMe`
- `GET /api/v1/users`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`
- `GET /api/v1/users/audit-logs`
- `GET /api/v1/quizzes`
- `GET /api/v1/quizzes/:id`
- `POST /api/v1/quizzes`
- `PATCH /api/v1/quizzes/:id`
- `DELETE /api/v1/quizzes/:id`
- `GET /api/v1/quizzes/:id/questions`
- `POST /api/v1/quizzes/:id/questions`
- `PATCH /api/v1/quizzes/:id/questions/:questionId`
- `DELETE /api/v1/quizzes/:id/questions/:questionId`
- `POST /api/v1/quizzes/:id/results`

## Testing

Backend build:

```bash
cd backend
npm run build
```

Frontend build:

```bash
cd frontend
npm run build
```

Backend tests:

```bash
cd backend
npm test
```

## Notes

- Teachers and admins can retake quizzes without duplicate-result rejection.
- Admin content management supports question images from external URLs, local asset paths, and uploaded files converted to `data:image`.
- Admin CRUD actions are written to the audit log collection.
