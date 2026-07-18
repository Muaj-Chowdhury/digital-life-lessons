# Setup Guide

This guide explains how to set up the **Digital Life Lessons Platform** for local development, configure environment variables, run the application manually, and use Docker for a containerized development environment.

---

# Table of Contents

- [Prerequisites](#prerequisites)
- [Project Requirements](#project-requirements)
- [Clone the Repository](#clone-the-repository)
- [Environment Variables](#environment-variables)
- [Firebase Service Account Setup](#firebase-service-account-setup)
- [Local Development (Manual)](#local-development-manual)
- [Local Development (Docker)](#local-development-docker)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)

---

# Prerequisites

Before running the project, ensure the following software and services are available.

## Required Software

- Node.js (v20 or higher)
- npm (comes with Node.js)
- Git

## Optional Software

- Docker
- Docker Compose
- MongoDB Compass

---

# Project Requirements

The application depends on the following external services.

| Service | Purpose |
|----------|---------|
| MongoDB Atlas | Cloud Database |
| Firebase Authentication | User Authentication |
| ImgBB | Image Upload |
| Stripe | Premium Membership Payments |

---

# Clone the Repository

Clone the repository and navigate into the project directory.

```bash
git clone https://github.com/your-username/digital-life-lessons.git

cd digital-life-lessons
```

---

# Environment Variables

Create a `.env` file in the project root.

```
digital-life-lessons/
│
├── client/
├── server/
├── .env
└── docker-compose.yml
```

---

## Client Environment Variables

These variables are required during the Vite build process.

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

## Server Environment Variables

These variables are loaded at runtime by the Express server.

```env
PORT=3000

DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password

FB_SERVICE_KEY=your_base64_encoded_firebase_service_account_json

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLIENT_DOMAIN=http://localhost:5173
```

---

# Firebase Service Account Setup

The backend verifies Firebase JWT tokens using the Firebase Admin SDK.

Instead of committing the Service Account JSON file to Git, convert it into a Base64 string.

## Step 1

Download the Firebase Service Account JSON file.

```
Firebase Console

Project Settings

↓

Service Accounts

↓

Generate New Private Key
```

---

## Step 2

Place the downloaded JSON file inside the `server` directory.

```
server/
│
├── serviceAccount.json
└── serviceKeyConverter.js
```

---

## Step 3

Run the conversion script.

```bash
cd server

node serviceKeyConverter.js
```

---

## Step 4

Copy the generated Base64 string into:

```env
FB_SERVICE_KEY=
```

---

# Local Development (Manual)

## 1. Install Backend Dependencies

```bash
cd server

npm install
```

---

## 2. Start Backend Server

```bash
npm run start
```

or

```bash
nodemon index.js
```

The server will start at

```
http://localhost:3000
```

---

## 3. Install Frontend Dependencies

```bash
cd ../client

npm install
```

---

## 4. Start Frontend

```bash
npm run dev
```

The application will start at

```
http://localhost:5173
```

---

# Local Development (Docker)

Docker Compose allows the frontend and backend to run together.

## Build Containers

```bash
docker compose up --build
```

This command:

- Builds the React application
- Builds the Express server
- Starts MongoDB connections
- Configures Nginx
- Starts all containers

---

## Run Containers

```bash
docker compose up
```

---

## Run in Background

```bash
docker compose up -d
```

---

## View Logs

```bash
docker compose logs -f
```

---

## Stop Containers

```bash
docker compose down
```

---

## Remove Containers & Volumes

```bash
docker compose down -v
```

---

# Useful Commands

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

## Start Development Servers

Backend

```bash
npm run start
```

Frontend

```bash
npm run dev
```

---

## Build Frontend

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

# Troubleshooting

## Environment Variables Not Loading

- Restart the development server.
- Ensure the `.env` file is in the project root.
- Verify all `VITE_` variables begin with the `VITE_` prefix.

---

## Firebase Authentication Fails

Verify:

- Firebase Authentication is enabled.
- Google Sign-In is enabled.
- Authorized domains are configured.
- `FB_SERVICE_KEY` contains a valid Base64 string.

---

## MongoDB Connection Error

Check:

- Database username
- Password
- Network access (IP whitelist)
- Connection string

---

## Stripe Errors

Verify:

- Secret Key
- Webhook Secret
- Correct webhook endpoint
- Local Stripe CLI forwarding (if testing locally)

---

# Next Steps

After completing the setup:

1. Read **FEATURES.md** to understand the application's core functionality.
2. Read **ARCHITECTURE.md** to learn the request lifecycle and middleware pipeline.
3. Read **DEPLOYMENT.md** to deploy the application using Docker and GitHub Actions.

---

# Related Documentation

- 📐 **ARCHITECTURE.md** – System architecture and request lifecycle.
- 📁 **PROJECT_STRUCTURE.md** – Monorepo layout and folder responsibilities.
- 🧩 **FEATURES.md** – Authentication, RBAC, search, filtering, and Stripe integration.
- 🚀 **DEPLOYMENT.md** – Docker, GitHub Actions, CI/CD, and production deployment.