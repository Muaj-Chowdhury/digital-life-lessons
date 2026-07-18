# Deployment Guide

This document explains how to deploy the **Digital Life Lessons Platform** using Docker, Docker Compose, GitHub Actions, Docker Hub, and Vercel. It also covers environment configuration, production builds, and CI/CD automation.

---

# Table of Contents

- [Deployment Overview](#deployment-overview)
- [Deployment Architecture](#deployment-architecture)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Docker Compose](#docker-compose)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Docker Hub](#docker-hub)
- [Vercel Deployment](#vercel-deployment)
- [Production Checklist](#production-checklist)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

---

---

# Deployment Overview

The project supports multiple deployment strategies:

- Local Development
- Docker Containers
- Docker Compose
- GitHub Actions CI/CD
- Docker Hub
- Vercel (Backend)
- Any VPS supporting Docker

The frontend and backend are deployed independently while sharing common environment variables.

---

# Deployment Architecture

```text
                   GitHub Repository
                          │
                          ▼
                GitHub Actions Workflow
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
        ▼                                    ▼
Frontend Docker Image                Backend Docker Image
        │                                    │
        ▼                                    ▼
        Docker Hub                     Docker Hub
        │                                    │
        └───────────────┬────────────────────┘
                        │
                 Docker Compose
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
    React + Nginx                Express Server
         │                             │
         └──────────────┬──────────────┘
                        ▼
                  MongoDB Atlas
                        │
          Firebase Authentication
                        │
                   Stripe Payments
```

---

# Environment Variables

The application requires separate environment variables for the frontend and backend.

## Client (.env)

```env
VITE_apiKey=your_api_key
VITE_authDomain=your_auth_domain
VITE_projectId=your_project_id
VITE_storageBucket=your_storage_bucket
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id
VITE_IMGBB_API_KEY=your_imgbb_key
VITE_API_URL=http://localhost:3000
```

---

## Server (.env)

```env
PORT=3000

DB_USER=your_db_user
DB_PASSWORD=your_db_password

FB_SERVICE_KEY=your_base64_service_key

STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

CLIENT_DOMAIN=http://localhost:5173
```

> Never commit `.env` files or secrets to Git.

---

# Docker Deployment

The project contains separate Dockerfiles for the frontend and backend.

## Client Dockerfile

The frontend uses a **multi-stage build**.

### Stage 1

- Install dependencies
- Build the Vite application
- Inject `VITE_*` build arguments

### Stage 2

- Copy built assets
- Serve using Nginx
- Expose port 80

---

## Build Client Image

```bash
cd client

docker build \
-t digital-life-lessons-client .
```

---

## Run Client Container

```bash
docker run -p 5173:80 digital-life-lessons-client
```

---

# Backend Dockerfile

The backend uses a production Node.js image.

Responsibilities

- Install production dependencies
- Copy server source
- Start Express server

---

## Build Backend Image

```bash
cd server

docker build \
-t digital-life-lessons-server .
```

---

## Run Backend Container

```bash
docker run \
-p 3000:3000 \
--env-file .env \
digital-life-lessons-server
```

---

# Docker Compose

The root `docker-compose.yml` orchestrates the complete application.

It launches:

- Frontend
- Backend

The frontend depends on the backend container.

---

## Build Everything

```bash
docker-compose up --build
```

---

## Run in Background

```bash
docker-compose up -d
```

---

## View Logs

```bash
docker-compose logs -f
```

---

## Stop Containers

```bash
docker-compose down
```

---

## Remove Containers & Volumes

```bash
docker-compose down -v
```

---

# GitHub Actions CI/CD

The project contains two GitHub Actions workflows.

```text
.github/
└── workflows/
    ├── backend-deploy.yml
    └── frontend-deploy.yml
```

---

## Backend Workflow

Automatically:

- Detects backend changes
- Builds Docker image
- Logs into Docker Hub
- Pushes image

Triggered when:

```text
server/**
```

changes are pushed to the main branch.

---

## Frontend Workflow

Automatically:

- Detects frontend changes
- Builds Vite project
- Injects build arguments
- Creates Docker image
- Pushes image

Triggered when:

```text
client/**
```

changes are pushed to the main branch.

---

# Required GitHub Secrets

Configure the following repository secrets.

| Secret | Description |
|---------|-------------|
| DOCKERHUB_USERNAME | Docker Hub Username |
| DOCKERHUB_TOKEN | Docker Hub Access Token |
| VITE_apiKey | Firebase API Key |
| VITE_authDomain | Firebase Auth Domain |
| VITE_projectId | Firebase Project ID |
| VITE_storageBucket | Firebase Storage Bucket |
| VITE_messagingSenderId | Firebase Sender ID |
| VITE_appId | Firebase App ID |
| VITE_IMGBB_API_KEY | ImgBB API Key |

---

# Docker Hub

GitHub Actions automatically pushes production images to Docker Hub.

Example image names

```text
username/digital-life-lessons-client

username/digital-life-lessons-server
```

These images can later be deployed on any Docker-compatible server.

---

# Backend Deployment on Vercel

The backend includes a `vercel.json` configuration.

Deployment steps:

1. Install Vercel CLI

```bash
npm install -g vercel
```

2. Login

```bash
vercel login
```

3. Deploy

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

Ensure all required environment variables are configured in the Vercel project settings before deployment.

---

# Production Deployment Checklist

Before deploying, verify that:

- Node.js version is compatible.
- MongoDB Atlas is accessible.
- Firebase Authentication is configured.
- Firebase Admin Service Account is Base64 encoded.
- Stripe API keys are valid.
- Stripe webhook endpoint is configured.
- Docker images build successfully.
- GitHub Actions workflows pass.
- Required GitHub Secrets are configured.
- `.env` files are excluded from version control.

---

# Troubleshooting

## Docker Build Fails

Possible causes:

- Missing environment variables
- Incorrect Dockerfile path
- Dependency installation errors

---

## Frontend Cannot Reach Backend

Verify:

- `VITE_API_URL`
- Docker networking
- Backend container status
- CORS configuration

---

## Authentication Errors

Check:

- Firebase configuration
- Firebase Admin credentials
- JWT token generation
- Authorization headers

---

## Stripe Webhook Issues

Verify:

- Webhook secret
- Stripe Dashboard configuration
- Endpoint URL
- Signature verification

---

## MongoDB Connection Failed

Verify:

- Username
- Password
- Atlas IP whitelist
- Connection string

---

# Deployment Workflow Summary

```text
Developer
     │
     ▼
Git Push
     │
     ▼
GitHub Repository
     │
     ▼
GitHub Actions
     │
     ▼
Docker Build
     │
     ▼
Docker Hub
     │
     ▼
Production Server
     │
     ▼
Docker Compose
     │
     ▼
Frontend + Backend
     │
     ▼
MongoDB Atlas
```

---

# Related Documentation

- 📐 **ARCHITECTURE.md** — System architecture and request lifecycle.
- 📁 **PROJECT_STRUCTURE.md** — Repository layout and responsibilities.
- 🖥️ **CLIENT_STRUCTURE.md** — Frontend architecture.
- ⚙️ **SERVER_STRUCTURE.md** — Backend architecture.
- 🧰 **TECH_STACK.md** — Technologies and dependencies.
- 🚀 **SETUP.md** — Local installation and development.
- 🧩 **FEATURES.md** — Feature implementation details.