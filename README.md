# Digital Life Lessons Platform

**Live Site:** https://digital-life-lessons-562ea.web.app/

A comprehensive, production-grade community-driven platform for sharing real-life experiences, career insights, personal growth milestones, and lessons learned. Rather than focusing solely on academic knowledge, Digital Life Lessons enables users to document and discover practical wisdom gained through real-world experiences.

---
# Table of Contents

- [Documentation](#documentation)
- [Project Purpose](#project-purpose)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Environment Configuration](#environment-configuration)
- [Feature Implementation](#feature-implementation)
- [Installation Guide](#installation-guide)
- [Docker](#docker)
- [Continuous Integration & Deployment](#continuous-integration--deployment)
- [Additional Documentation](#additional-documentation)
# Documentation

Detailed technical documentation is available in the `docs/` directory.

| Document | Description |
|----------|-------------|
|  [Architecture](docs/ARCHITECTURE.md) | System architecture, request lifecycle, middleware flow, and diagrams |
|  [Project Structure](docs/PROJECT_STRUCTURE.md) | Repository organization and directory responsibilities |
|  [Client Structure](docs/CLIENT_STRUCTURE.md) | Frontend folder structure, hooks, pages, layouts, and components |
|  [Server Structure](docs/SERVER_STRUCTURE.md) | Backend architecture, middleware, API layer, authentication, and database |
|  [Technology Stack](docs/TECH_STACK.md) | Technologies, frameworks, libraries, and external services |
|  [Features](docs/FEATURES.md) | Complete feature implementation and platform capabilities |
|  [Setup Guide](docs/SETUP.md) | Installation, environment variables, and local development |
|  [Deployment Guide](docs/DEPLOYMENT.md) | Docker, Docker Compose, GitHub Actions, and production deployment |

# Project Purpose

## Platform Summary

The **Digital Life Lessons** platform is a full-stack web application designed to facilitate the sharing of experiential wisdom.

Users can publish, organize, search, and interact with lessons covering topics such as:

- Career experiences
- Personal development
- Relationships
- Mindset shifts
- Life mistakes
- Success stories

The platform serves as a collaborative knowledge base where individuals learn from one another's experiences.

---

## Target User Personas

### Regular Users

Regular users can:

- Browse public lessons
- Search and filter lessons
- Save lessons to favourites
- Comment on lessons
- Report inappropriate content

### Premium Subscribers

Premium members gain additional capabilities:

- Access Premium lessons
- Publish Premium lessons
- Lifetime premium access after one-time payment
- Increased content visibility

### Administrators

Administrators are responsible for:

- User management
- Role assignment
- Lesson moderation
- Reviewing reports
- Monitoring platform analytics

---

## Core Features

### Wisdom Sharing

- Create lessons
- Edit lessons
- Soft delete lessons
- Report inappropriate content

### Premium Membership

- Stripe one-time payment
- Lifetime Premium access
- Premium lesson publishing

### Analytics Dashboard

- User registration charts
- Lesson creation charts
- Platform growth monitoring

### Search & Filtering

Supports:

- Full-text search
- Category filtering
- Emotional tone filtering
- Debounced search input
- Pagination

---

# System Architecture

The **Digital Life Lessons Platform** follows a **decoupled full-stack architecture**, where the frontend and backend operate independently while communicating through a secure REST API.

The application is built around four primary layers:

```text
React Client
      │
      ▼
Express REST API
      │
      ▼
MongoDB Atlas

External Services
 ├── Firebase Authentication
 └── Stripe Payments
```

### Architecture Highlights

- **Frontend:** React + Vite application responsible for the user interface, routing, authentication state, and API communication.
- **Backend:** Express.js REST API handling business logic, authentication, authorization, payments, and database operations.
- **Database:** MongoDB Atlas stores users, lessons, comments, favourites, reports, and analytics data.
- **External Services:**
  - **Firebase Authentication** manages user authentication and JWT verification.
  - **Stripe** powers Premium Membership payments and webhook processing.

### Request Flow

A typical authenticated request follows this lifecycle:

```text
React UI
    │
    ▼
useAxiosSecure
    │
    ▼
Express API
    │
    ▼
verifyJWT
    │
    ▼
verifyADMIN (Protected Routes)
    │
    ▼
MongoDB Atlas
```

> 📐 **Want to explore the complete architecture?**
>
> See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for:
>
> - Authentication & session handshake diagrams
> - Request lifecycle
> - Express middleware pipeline
> - Client-server communication
> - Mermaid architecture diagrams
> - Component responsibilities

# Project Structure

```text
.github/
    workflows/
        backend-deploy.yml
        frontend-deploy.yml

client/
    src/
        component/
        context/
        hooks/
        layouts/
        pages/
        routes/
    main.jsx

    Dockerfile

server/
    index.js
    serviceKeyConverter.js
    Dockerfile
    vercel.json

docker-compose.yml
.env
```

---
For a detailed explanation of every folder and file, see:

-  [Project Structure](docs/PROJECT_STRUCTURE.md)
-  [Client Structure](docs/CLIENT_STRUCTURE.md)
-  [Server Structure](docs/SERVER_STRUCTURE.md)


## Directory Responsibilities

### `.github/workflows`

Contains GitHub Actions workflows responsible for automatically building and publishing Docker images.

- Frontend CI/CD
- Backend CI/CD

---

### `client`

Contains the React frontend application.

Responsibilities include:

- User Interface
- Routing
- Authentication
- API communication
- Dashboard
- Shared components

---

### `server`

Contains the Express backend.

Responsibilities include:

- REST API
- Middleware
- Authentication
- Stripe integration
- MongoDB operations
- Business logic

---

### Docker

The repository includes Docker support for both frontend and backend services.

- Multi-stage React build
- Production Node server
- Docker Compose for local development

---

# Technology Stack

| Technology | Purpose | Layer |
|------------|---------|-------|
| React 18 | User Interface | Frontend |
| React Router | Routing | Frontend |
| TanStack Query | Server State | Frontend |
| Axios | HTTP Client | Frontend |
| Firebase Client SDK | Authentication | Security |
| Express.js | REST API | Backend |
| MongoDB Native Driver | Database | Backend |
| Firebase Admin SDK | JWT Verification | Security |
| Stripe SDK | Payments | Payment |
| Docker | Containerization | DevOps |
| GitHub Actions | CI/CD | DevOps |

---
For a detailed explanation of each technology and why it is used, see:

## -  [Technology Stack Documentation](docs/TECH_STACK.md)

# Environment Configuration

The project separates environment variables into **client-side build-time variables** and **server-side runtime variables**.

## Client Environment (`client/.env`)

These variables are compiled into the frontend during the Vite build process.

```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_API_URL=http://localhost:3000
```

---

## Server Environment (`server/.env`)

These variables are read at runtime by the Express server.

```env
PORT=3000

DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password

FB_SERVICE_KEY=your_base64_encoded_service_account

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

CLIENT_DOMAIN=http://localhost:5173
```

---

# Feature Implementation
For complete feature documentation, see:

## -  [Features Documentation](docs/FEATURES.md)

## Role-Based Access Control (RBAC)

The application implements authorization on both the client and the server.

### Client-side Protection

Administrative pages are protected using:

- `AdminRoute`
- `useRole`

If the authenticated user's role is not `admin`, access is denied.

---

### Server-side Protection

Protected endpoints execute the following middleware pipeline:

```
verifyJWT
        │
        ▼
verifyADMIN
        │
        ▼
Protected Route
```

`verifyJWT`

- Verifies Firebase JWT
- Extracts authenticated email

`verifyADMIN`

- Retrieves the user from MongoDB
- Confirms the role is `admin`
- Returns **403 Forbidden** when authorization fails

---

## Lesson Search & Filtering

The platform supports dynamic filtering with server-side pagination.

### Client Features

- Debounced search (500 ms)
- Category filter
- Emotional tone filter
- Sorting
- Pagination

---

### Server Features

The `/lessons` endpoint supports:

- visibility
- category
- tone
- search
- page
- limit
- sortBy

Filtering uses MongoDB query construction.

Search performs case-insensitive matching against:

- title
- description

Sorting options include:

- Newest
- Most Saved

Pagination is implemented using:

- `skip()`
- `limit()`
- `countDocuments()`

---

## Premium Membership

Premium membership is powered by Stripe Checkout.

### Checkout Flow

```
Upgrade Button
        │
        ▼
POST /create-checkout-session
        │
        ▼
Stripe Checkout
        │
        ▼
Payment Success
        │
        ▼
Stripe Webhook
        │
        ▼
MongoDB User Upgrade
```

---

### Checkout Session

The backend creates a Stripe Checkout Session containing:

- Premium Lifetime product
- User email metadata
- Success URL
- Cancel URL

---

### Webhook Processing

After successful payment:

1. Stripe sends a `checkout.session.completed` event.
2. The webhook verifies the Stripe signature.
3. The backend upgrades the user:

- `isPremium = true`
- `premiumActivatedAt = current date`

---

# Installation Guide

## Prerequisites

Install and configure:

- Node.js 20+
- MongoDB Atlas
- Firebase Project
- Stripe Developer Account

---

## Firebase Service Account Conversion

Convert the Firebase Admin SDK JSON into Base64.

```bash
cd server

node serviceKeyConverter.js
```

Copy the generated output into:

```env
FB_SERVICE_KEY=
```

---

## Install Dependencies

Backend

```bash
cd server
npm install
```

Frontend

```bash
cd client
npm install
```

---

## Run Locally

Backend

```bash
cd server

npm run start
```

Frontend

```bash
cd client

npm run dev
```

---
For a complete installation walkthrough, environment configuration, and troubleshooting, see:

## -  [Setup Guide](docs/SETUP.md)

# Docker

## Client Container

The frontend uses a **multi-stage Docker build**.

### Stage 1

- Node.js 20 Alpine
- Install dependencies
- Compile Vite application

### Stage 2

- Nginx Alpine
- Serve static assets
- Small production image

---

## Server Container

The backend uses a lightweight production Node.js container.

Characteristics:

- Node 20 Alpine
- Production dependencies only
- Exposes port 3000

---

## Docker Compose

The project includes a root `docker-compose.yml`.

Services:

### Backend

- Builds from `./server`
- Loads runtime environment
- Exposes port **3000**

### Frontend

- Builds from `./client`
- Injects Vite build arguments
- Runs on Nginx
- Exposes **5173**

---

## Docker Commands

Build and start

```bash
docker-compose up --build -d
```

View logs

```bash
docker-compose logs -f
```

Stop containers

```bash
docker-compose down -v
```

---
For production deployment, Docker Compose, GitHub Actions, Docker Hub, and Vercel deployment, see:

## -  [Deployment Guide](docs/DEPLOYMENT.md)

# Continuous Integration & Deployment

The project includes automated GitHub Actions workflows.

## Backend Workflow

Triggered when changes are pushed to:

```
server/
```

Pipeline:

- Login to Docker Hub
- Build Docker image
- Push image

---

## Frontend Workflow

Triggered when changes are pushed to:

```
client/
```

Pipeline:

- Login to Docker Hub
- Inject GitHub Secrets
- Build Vite application
- Build Docker image
- Push image

---

## Required GitHub Secrets

| Secret | Purpose |
|---------|---------|
| DOCKERHUB_USERNAME | Docker Hub username |
| DOCKERHUB_TOKEN | Docker Hub access token |
| VITE_apiKey | Firebase API Key |
| VITE_authDomain | Firebase Auth Domain |
| VITE_projectId | Firebase Project ID |
| VITE_storageBucket | Firebase Storage |
| VITE_messagingSenderId | Firebase Messaging Sender |
| VITE_appId | Firebase App ID |
| VITE_IMGBB_API_KEY | ImgBB image upload key |

---
# Additional Documentation

For detailed implementation guides, architecture diagrams, deployment instructions, and technical documentation, explore the files in the `docs/` directory.

-  [Architecture](docs/ARCHITECTURE.md)
-  [Project Structure](docs/PROJECT_STRUCTURE.md)
-  [Client Structure](docs/CLIENT_STRUCTURE.md)
-  [Server Structure](docs/SERVER_STRUCTURE.md)
-  [Technology Stack](docs/TECH_STACK.md)
-  [Features](docs/FEATURES.md)
-  [Setup Guide](docs/SETUP.md)
-  [Deployment Guide](docs/DEPLOYMENT.md)
