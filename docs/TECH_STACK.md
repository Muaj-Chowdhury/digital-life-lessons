# Technology Stack

This document provides a comprehensive overview of the technologies, frameworks, libraries, and external services used in the **Digital Life Lessons Platform**. It explains the purpose of each technology and how it contributes to the overall architecture.

---

# Table of Contents

- [Overview](#overview)
- [Frontend Technologies](#frontend-technologies)
- [Backend Technologies](#backend-technologies)
- [Database](#database)
- [Authentication & Security](#authentication--security)
- [Payment Processing](#payment-processing)
- [Image Hosting](#image-hosting)
- [DevOps & Deployment](#devops--deployment)
- [Development Tools](#development-tools)
- [Technology Stack Matrix](#technology-stack-matrix)
- [Version Compatibility](#version-compatibility)

---

# Overview

The Digital Life Lessons Platform is built using a modern JavaScript full-stack architecture.

The project consists of:

- React + Vite Frontend
- Express.js Backend
- MongoDB Atlas Database
- Firebase Authentication
- Stripe Payment Gateway
- Docker Containerization
- GitHub Actions CI/CD

---

# Frontend Technologies

## React

**Purpose**

- Build reusable UI components
- Manage application state
- Render dynamic interfaces

**Used For**

- Component-based architecture
- Virtual DOM rendering
- Client-side interactions

---

## Vite

**Purpose**

Frontend build tool and development server.

**Features**

- Lightning-fast development server
- Hot Module Replacement (HMR)
- Optimized production builds

---

## React Router

**Purpose**

Client-side routing.

**Responsibilities**

- Page navigation
- Nested layouts
- Route protection
- Dynamic routes

---

## TanStack Query (React Query)

**Purpose**

Server state management.

**Responsibilities**

- Data fetching
- API caching
- Background synchronization
- Pagination
- Automatic refetching

---

## Axios

**Purpose**

HTTP client for communicating with the backend.

Two Axios instances are used:

### useAxios

- Public API requests

### useAxiosSecure

- Protected API requests
- JWT injection
- Response interceptors
- Automatic logout

---

## React Hook Form *(if used)*

**Purpose**

Form state management.

Used for

- Validation
- Form submission
- Performance optimization

---

## Tailwind CSS

**Purpose**

Utility-first CSS framework.

Benefits

- Rapid UI development
- Responsive design
- Consistent styling

---

## DaisyUI *(if used)*

**Purpose**

Tailwind CSS component library.

Provides

- Buttons
- Cards
- Modals
- Alerts
- Navigation components

---

# Backend Technologies

## Node.js

JavaScript runtime powering the backend server.

Responsibilities

- Server execution
- Package management
- Runtime environment

---

## Express.js

Backend framework.

Responsibilities

- REST API
- Middleware
- Routing
- Error handling

---

## MongoDB Native Driver

Provides direct communication with MongoDB.

Responsibilities

- CRUD operations
- Aggregation pipelines
- Index management
- Transactions

---

# Database

## MongoDB Atlas

Cloud-hosted NoSQL database.

Responsibilities

- User data
- Lessons
- Comments
- Favorites
- Payments
- Reports

Benefits

- Scalability
- Automatic backups
- Cloud hosting
- Aggregation framework

---

# Authentication & Security

## Firebase Authentication

Responsible for

- Google Sign-In
- Email & Password Authentication
- User management
- JWT generation

---

## Firebase Admin SDK

Used on the backend.

Responsibilities

- JWT verification
- Secure authentication
- User identity validation

---

## JSON Web Tokens (JWT)

JWTs secure all protected API requests.

Flow

```
User Login

↓

Firebase

↓

JWT Token

↓

Axios Secure

↓

Express

↓

verifyJWT

↓

Protected Route
```

---

# Payment Processing

## Stripe

Used for premium membership payments.

Responsibilities

- Checkout Sessions
- Payment Processing
- Webhook Events
- Premium Membership Activation

---

# Image Hosting

## ImgBB

Stores lesson images uploaded by users.

Responsibilities

- Image uploads
- Image hosting
- Public image URLs

---

# DevOps & Deployment

## Docker

Containerizes both frontend and backend.

Benefits

- Consistent environments
- Easy deployment
- Simplified development

---

## Docker Compose

Runs all containers together.

Responsibilities

- Container orchestration
- Networking
- Environment configuration

---

## GitHub Actions

Provides Continuous Integration and Continuous Deployment (CI/CD).

Responsibilities

- Build Docker images
- Push images to Docker Hub
- Automate deployment pipelines

---

## Nginx

Used in the frontend production container.

Responsibilities

- Serve static React files
- Reverse proxy (optional)
- High-performance web server

---

## Vercel *(Optional Backend Deployment)*

Supports deployment of the backend as serverless functions.

---

# Development Tools

## Git

Version control.

---

## GitHub

Repository hosting.

---

## npm

Package manager.

Responsibilities

- Dependency installation
- Script execution

---

## ESLint

Maintains code quality.

Responsibilities

- Static analysis
- Coding standards
- Error detection

---

## Prettier *(Optional)*

Automatic code formatting.

---

# Technology Stack Matrix

| Technology | Purpose | Layer |
|------------|---------|-------|
| React | Component-based UI | Frontend |
| Vite | Build Tool | Frontend |
| React Router | Routing | Frontend |
| TanStack Query | Server State Management | Frontend |
| Axios | HTTP Client | Frontend |
| React Hook Form | Forms | Frontend |
| Tailwind CSS | Styling | Frontend |
| DaisyUI | UI Components | Frontend |
| Node.js | Runtime | Backend |
| Express.js | REST API | Backend |
| MongoDB Native Driver | Database Operations | Backend |
| MongoDB Atlas | Cloud Database | Database |
| Firebase Authentication | Authentication | Security |
| Firebase Admin SDK | JWT Verification | Security |
| Stripe | Payments | Payment |
| ImgBB | Image Hosting | External Service |
| Docker | Containerization | DevOps |
| Docker Compose | Container Orchestration | DevOps |
| GitHub Actions | CI/CD | DevOps |
| Nginx | Static File Server | Deployment |
| Vercel | Server Deployment | Deployment |

---

# Version Compatibility

| Software | Recommended Version |
|----------|---------------------|
| Node.js | 20.x or higher |
| npm | Latest LTS |
| React | 18+ |
| React Router | v6/v7 |
| TanStack Query | v5 |
| Express | Latest Stable |
| MongoDB | Atlas Latest |
| Docker | Latest Stable |
| Docker Compose | v2+ |

---

# Architecture Summary

```text
                React + Vite
                      │
             React Router
                      │
              TanStack Query
                      │
                  Axios
                      │
        ┌─────────────┴─────────────┐
        │                           │
 Firebase Auth                Express API
        │                           │
 Firebase Admin SDK          MongoDB Atlas
        │                           │
        └─────────────┬─────────────┘
                      │
                 Stripe API
                      │
              Premium Membership
```

---

# Related Documentation

- 📐 **ARCHITECTURE.md** — System architecture and request lifecycle.
- 📁 **PROJECT_STRUCTURE.md** — Monorepo organization and folder responsibilities.
- 🖥️ **CLIENT_STRUCTURE.md** — Frontend architecture and organization.
- ⚙️ **SERVER_STRUCTURE.md** — Backend architecture and organization.
- 🧩 **FEATURES.md** — Feature implementation details.
- 🚀 **SETUP.md** — Installation and local development.
- 🐳 **DEPLOYMENT.md** — Docker, CI/CD, and production deployment.