# Dent App Frontend

React client for the Dent App platform.

## What The Frontend Does

- authenticates users and restores session state
- renders quiz catalog and quiz-taking flow
- shows result history for users
- shows student results for teachers
- provides admin UI for:
  - user management
  - quiz management
  - question management
- supports question images and quiz icons from:
  - backend/static local paths
  - external URLs
  - uploaded files converted to `data:image`

## Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- MUI

## Environment

Optional `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3555
```

If omitted, the app uses `http://localhost:3555`.

## Run Locally

```bash
cd frontend
npm install
npm run start-dev
```

Frontend URL:

- `http://localhost:5173`

## Scripts

```bash
npm run start-dev
npm run build
npm run lint
```

## Main Frontend Routes

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
- `/options`

## Access Model

- guest:
  - can open public screens such as login, signup, lectures, anatomy, quiz list
  - cannot start protected quiz flow
- user:
  - can take quizzes once
  - can view personal results
- teacher:
  - can retake quizzes without limit
  - can view student results
- admin:
  - can retake quizzes without limit
  - can manage users
  - can manage quizzes and questions

## Notes

- The client resolves image and icon sources through a shared asset resolver, so `http`, `https`, `data`, `blob`, and local paths are supported.
- Admin forms have client-side validation before requests are sent.
- API errors are normalized so user-facing forms show readable backend validation messages.
