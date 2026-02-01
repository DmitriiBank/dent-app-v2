# Dent App Project

This is a full-stack Quiz Application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- **backend**: Node.js/Express server with MongoDB connection. Handles authentication, quiz management, and user results.
- **frontend**: React application (Vite) with Redux for state management. Provides UI for taking quizzes, viewing results, and admin management.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas URI)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd quiz-app
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Backend:**
    - Create a `.env` file in the `backend` directory.
    - Add the following variables:
      ```env
      PORT=3555
      DATABASE=mongodb://localhost:27017/quiz-app
      JWT_SECRET=your-very-secure-secret-key-min-32-chars
      JWT_EXPIRES_IN=90d
      JWT_COOKIE_EXPIRES_IN=90
      NODE_ENV=development
      ```

2.  **Frontend:**
    - Create a `.env` file in the `frontend` directory (optional if using default localhost:5173).
    - Add:
      ```env
      VITE_API_URL=http://localhost:5173
      ```

### Running the Application

1.  **Start Backend:**
    ```bash
    cd backend
    npm start
    # OR for development with watch mode:
    npm run start-server-dev
    ```

2.  **Start Frontend:**
    ```bash
    cd frontend
    npm run start-dev
    ```

3.  Open your browser at `http://localhost:5173`.

## Features

- **Authentication**: User signup, login, and Google OAuth.
- **Quizzes**: Browse and take quizzes.
- **Results**: View your test history and scores.
- **Admin Panel**: Manage quizzes and view all user results (requires 'admin' role).

## API Documentation

The backend provides Swagger documentation at `http://localhost:3555/docs` when the server is running.
