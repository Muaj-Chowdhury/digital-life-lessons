# Project Structure

This document describes the **monorepo organization**, directory layout, and the responsibility of each major folder and file in the **Digital Life Lessons Platform**.

---

# Table of Contents

- [Repository Overview](#repository-overview)
- [Monorepo Directory Structure](#monorepo-directory-structure)
- [Root Directory](#root-directory)
- [Client Application](#client-application)
- [Server Application](#server-application)
- [GitHub Workflows](#github-workflows)
- [Configuration Files](#configuration-files)
- [Project Organization Principles](#project-organization-principles)

---

# Repository Overview

The project follows a **monorepo architecture**, where both the frontend and backend applications are maintained within a single repository.

Benefits include:

- Unified version control
- Easier dependency management
- Shared documentation
- Simplified CI/CD workflows
- Centralized Docker configuration

---

# Monorepo Directory Structure

```text
digital-life-lessons/
│
├── .github/
│   └── workflows/
│       ├── backend-deploy.yml
│       └── frontend-deploy.yml
│
├── client/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── index.js
│   ├── Dockerfile
│   ├── serviceKeyConverter.js
│   ├── vercel.json
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PROJECT_STRUCTURE.md
│   ├── SETUP.md
│   ├── FEATURES.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── .env
├── .gitignore
├── LICENSE
└── README.md
```

---

# Root Directory

The root directory contains shared configuration files and project documentation.

| File | Purpose |
|------|---------|
| `README.md` | Project overview and quick start guide |
| `docker-compose.yml` | Runs frontend and backend containers together |
| `.env` | Shared environment variables (Docker setup) |
| `.gitignore` | Git ignored files |
| `LICENSE` | Project license |
| `docs/` | Technical documentation |

---

# Client Application

The **client** folder contains the React frontend built with Vite.

```text
client/
│
├── public/
├── src/
├── Dockerfile
├── package.json
└── vite.config.js
```

---

## public/

Contains static assets served directly by Vite.

Examples:

- favicon
- images
- static files

---

## src/

Contains the application source code.

```text
src/
│
├── assets/
├── components/
├── context/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── utils/
└── main.jsx
```

---

## assets/

Stores static resources imported into React.

Examples:

- Images
- Icons
- Fonts

---

## components/

Reusable UI components.

Examples:

- Navbar
- Footer
- Cards
- Buttons
- Loaders
- Modals

---

## context/

Global React Context providers.

Example:

```text
AuthProvider.jsx
```

Responsibilities:

- Firebase Authentication
- User session management
- Authentication state

---

## hooks/

Custom React hooks.

Examples:

### useAxios

- Public API requests
- No authentication

### useAxiosSecure

- Protected API requests
- JWT injection
- Automatic logout
- Response interception

---

## layouts/

Shared application layouts.

Examples:

- RootLayout
- Dashboard
- Authentication Layout

---

## pages/

Application pages.

Examples:

- Home
- Public Lessons
- Lesson Details
- Dashboard
- Upgrade
- Login
- Register

---

## routes/

Application routing.

Responsibilities:

- Route configuration
- Protected routes
- Admin routes
- Nested routing

---

## services/

Business logic or API helper modules.

Examples:

- Firebase configuration
- API utilities

---

## utils/

Reusable helper functions.

Examples:

- Date formatting
- Validation
- Utility functions

---

## Dockerfile

Creates the production frontend image.

Uses:

- Node.js (Build Stage)
- Vite
- Nginx (Production)

---

# Server Application

The **server** folder contains the Express backend.

```text
server/
│
├── index.js
├── Dockerfile
├── package.json
├── serviceKeyConverter.js
└── vercel.json
```

---

## index.js

The main Express application.

Responsibilities:

- Express server
- API routes
- Middleware
- Database connection
- Stripe integration
- Firebase Admin
- MongoDB operations

---

## Dockerfile

Creates the production backend image.

Responsibilities:

- Install production dependencies
- Build runtime environment
- Launch Express server

---

## serviceKeyConverter.js

Utility script used to convert the Firebase Service Account JSON into a Base64 string for secure storage in environment variables.

---

## vercel.json

Configuration file for deploying the backend to Vercel.

---

# GitHub Workflows

GitHub Actions automate Docker image creation and deployment.

```text
.github/
└── workflows/
```

---

## backend-deploy.yml

Responsibilities:

- Trigger on backend changes
- Build Docker image
- Push image to Docker Hub

---

## frontend-deploy.yml

Responsibilities:

- Trigger on frontend changes
- Build Vite application
- Inject build-time environment variables
- Push Docker image to Docker Hub

---

# Configuration Files

## docker-compose.yml

Responsible for:

- Running frontend and backend together
- Network configuration
- Container orchestration
- Shared environment variables

---

## .env

Stores application configuration.

Examples:

- MongoDB credentials
- Firebase configuration
- Stripe keys
- API URLs

---

# Project Organization Principles

The project follows several architectural principles.

## Separation of Concerns

Frontend, backend, deployment, and documentation are separated into dedicated directories.

---

## Reusability

Shared logic is extracted into reusable:

- Components
- Hooks
- Context Providers
- Utility Functions

---

## Scalability

The project structure allows new:

- Pages
- Features
- APIs
- Services
- Documentation

to be added without major restructuring.

---

## Maintainability

Each directory has a single responsibility, making the project easier to understand, debug, and extend.

---

# Related Documentation

- 📐 **ARCHITECTURE.md** — System architecture and request lifecycle.
- ⚙️ **SETUP.md** — Installation, environment variables, and local development.
- 🧩 **FEATURES.md** — Authentication, RBAC, search, filtering, and Stripe implementation.
- 🚀 **DEPLOYMENT.md** — Docker, GitHub Actions, and production deployment.