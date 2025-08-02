# Snippet App

This repository contains a code snippet management application built with a Go backend and a React/Vite frontend.

## Project Structure

The project follows a monorepo-like structure:

-   `backend/`: Contains the Go API server for managing code snippets.
    -   `main.go`: The main entry point for the Go application.
    -   `go.mod`, `go.sum`: Go module files.
-   `frontend/`: Contains the React application for the user interface.
    -   `src/`: Contains React components, styles, and entry points.
    -   `public/`: Static assets.
    -   `package.json`, `package-lock.json`: Node.js package management files.
    -   `vite.config.ts`: Vite configuration.

## Getting Started

### Prerequisites

*   [Go](https://go.dev/doc/install) (version 1.18 or higher recommended)
*   [Node.js](https://nodejs.org/) (version 18 or higher recommended) and npm (or Yarn)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Initialize Go modules (if not already done):**
    ```bash
    go mod init snippet_app/backend
    ```
3.  **Install Gin Gonic framework:**
    ```bash
    go get -u github.com/gin-gonic/gin
    ```
4.  **Run the backend server:**
    ```bash
    go run main.go
    ```
    The backend API will be available at `http://localhost:8080`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The frontend application will be available at `http://localhost:5173/` (or another port if 5173 is in use).

## Usage

Once both the backend and frontend servers are running, you can access the application in your browser at `http://localhost:5173/`. You should be able to view, create, edit, and delete code snippets.

## API Endpoints (Backend)

The backend provides the following RESTful API endpoints:

-   `GET /snippets`: Retrieve a list of all code snippets.
-   `GET /snippets/{id}`: Retrieve a specific code snippet by its ID.
-   `POST /snippets`: Create a new code snippet. Request body should be a JSON object matching the `Snippet` structure.
-   `PUT /snippets/{id}`: Update an existing code snippet. Request body should be a JSON object matching the `Snippet` structure.
-   `DELETE /snippets/{id}`: Delete a code snippet by its ID.
