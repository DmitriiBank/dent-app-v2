# Dent App Backend

TypeScript + Express API for the Dent App platform.

## What The Backend Does

- authenticates users with local credentials and Google OAuth
- issues JWT-based sessions
- manages users with `user`, `teacher`, and `admin` roles
- stores quizzes, questions, and quiz results in MongoDB
- allows admin CRUD for quizzes, questions, and users
- lets teachers and admins retake quizzes without one-attempt restriction
- records admin CRUD actions in audit logs
- exposes Swagger documentation at `/docs`

## Stack

- Node.js
- TypeScript
- Express
- MongoDB + Mongoose
- Passport Google OAuth
- Zod validation
- Winston logging
- Jest + Supertest

## Environment Variables

Create `backend/.env` with at least:

```env
NODE_ENV=development
PORT=3555
DATABASE=mongodb://localhost:27017/dent_app
JWT_ACCESS_SECRET=replace-with-a-secure-secret
JWT_REFRESH_SECRET=replace-with-another-secure-secret
JWT_EXPIRES_IN=90d
SERVER_URL=http://localhost:3555
GOOGLE_CLIENT_URL=http://localhost:5173
LOG_LEVEL=info
```

Optional:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_FROM=
```

## Run Locally

```bash
cd backend
npm install
npm run start:dev
```

Server:

- API: `http://localhost:3555`
- Swagger: `http://localhost:3555/docs`

## Scripts

```bash
npm run start:dev    # development server with watch mode
npm run build        # compile TypeScript and copy app config
npm start            # run compiled app
npm test             # full Jest suite
npm run test:unit    # selected unit tests
npm run test:e2e     # e2e tests
```

## Main API Routes

### Auth

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/forgotPassword`
- `POST /api/v1/auth/resetPassword/:token`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/google`
- `GET /api/v1/auth/google/callback`

### User Self-Service

- `POST /api/v1/users/logout`
- `POST /api/v1/users/refresh`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/updateMe`
- `PATCH /api/v1/users/updatePassword`
- `DELETE /api/v1/users/deleteMe`

### Admin / Teacher

- `GET /api/v1/users`
  - admin and teacher
- `GET /api/v1/users/:id`
  - admin and teacher
- `POST /api/v1/users`
  - admin only
- `PATCH /api/v1/users/:id`
  - admin only
- `DELETE /api/v1/users/:id`
  - admin only
- `GET /api/v1/users/audit-logs`
  - admin only

### Quizzes

- `GET /api/v1/quizzes`
- `GET /api/v1/quizzes/:id`
- `POST /api/v1/quizzes`
  - admin only
- `PATCH /api/v1/quizzes/:id`
  - admin only
- `DELETE /api/v1/quizzes/:id`
  - admin only
- `POST /api/v1/quizzes/:id/results`
  - authenticated users

### Questions

- `GET /api/v1/quizzes/:id/questions`
  - authenticated users
- `GET /api/v1/quizzes/:id/questions/:questionId`
  - authenticated users
- `POST /api/v1/quizzes/:id/questions`
  - admin only
- `PATCH /api/v1/quizzes/:id/questions/:questionId`
  - admin only
- `DELETE /api/v1/quizzes/:id/questions/:questionId`
  - admin only

## Validation Rules Worth Knowing

- quiz title: minimum 3 characters
- quiz description: minimum 10 characters
- question text: minimum 5 characters
- question options: between 2 and 10 items
- `answer` must point to an existing option index
- image/icon fields may be:
  - `http://...`
  - `https://...`
  - `data:image/...`
  - `blob:...`
  - local asset path

## Audit Logs

The backend stores admin actions for:

- user create/update/delete
- quiz create/update/delete
- question create/update/delete

Audit log endpoint:

- `GET /api/v1/users/audit-logs`

## Notes

- The backend uses `express.json({ limit: "5mb" })` to support data URL image payloads.
- Current OpenAPI source file is stored in [docs/openapi.json](/Users/dmitrii/Desktop/BackEnd/quiz-app/backend/docs/openapi.json:1).
