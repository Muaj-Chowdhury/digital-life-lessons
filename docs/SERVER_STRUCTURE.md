# Server Structure

This document explains the architecture, folder organization, middleware, API layer, authentication, database access, and deployment configuration of the Express backend.

---

# Table of Contents

- [Server Overview](#server-overview)
- [Server Directory Structure](#server-directory-structure)
- [Express Entry Point](#express-entry-point)
- [Middleware](#middleware)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [API Routes](#api-routes)
- [Database](#database)
- [Stripe Integration](#stripe-integration)
- [Firebase Admin](#firebase-admin)
- [Utilities](#utilities)
- [Docker](#docker)
- [Deployment](#deployment)
- [Folder Organization Principles](#folder-organization-principles)

---

# Server Overview

The backend is responsible for

- REST API
- Business Logic
- Authentication
- Authorization
- Database Operations
- Payment Processing

---

# Server Directory Structure

```text
server/
│
├── index.js
├── Dockerfile
├── serviceKeyConverter.js
├── vercel.json
├── package.json
└── .env
```

---

# Express Entry Point

```text
index.js
```

Responsibilities

- Express Server
- API Routes
- Middleware
- MongoDB Connection
- Stripe Integration
- Firebase Admin SDK

---

# Middleware

Examples

- CORS
- express.json()
- verifyJWT
- verifyADMIN
- Stripe Webhook

Responsibilities

- Authentication
- Authorization
- Validation
- Security

---

# Authentication

Firebase Admin SDK verifies

- Firebase ID Tokens
- User Identity

---

# Authorization

Role checking

Examples

- Admin
- Premium User
- Regular User

---

# API Routes

Typical endpoints

```text
/users

/lessons

/comments

/favorites

/payments

/reports

/dashboard
```

Each route should

- Validate input
- Verify authentication
- Handle errors
- Return consistent responses

---

# Database

MongoDB Atlas

Collections may include

```text
users

lessons

favorites

comments

payments

reports
```

---

# Stripe Integration

Responsibilities

- Checkout Sessions
- Payment Verification
- Webhooks
- Premium Activation

---

# Firebase Admin SDK

Responsibilities

- JWT Verification
- User Authentication

---

# Utilities

## serviceKeyConverter.js

Converts Firebase Service Account JSON into Base64.

---

# Docker

The backend Docker image

- Uses Node.js
- Installs production dependencies
- Starts Express Server

---

# Deployment

Supports

- Docker
- Docker Compose
- GitHub Actions
- Vercel

---

# Folder Organization Principles

The backend follows

- Separation of Concerns
- Middleware Pipeline
- Secure Authentication
- Scalable API Design
- Modular Business Logic

---

# Related Documentation

- ARCHITECTURE.md
- PROJECT_STRUCTURE.md
- FEATURES.md
- DEPLOYMENT.md