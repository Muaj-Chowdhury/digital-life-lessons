# Client Structure

This document explains the organization, architecture, and responsibilities of the frontend application built with **React**, **Vite**, **React Router**, **TanStack Query**, and **Firebase Authentication**.

---

# Table of Contents

- [Project Overview](#project-overview)
- [Client Directory Structure](#client-directory-structure)
- [Source Directory](#source-directory)
- [Components](#components)
- [Context](#context)
- [Hooks](#hooks)
- [Layouts](#layouts)
- [Pages](#pages)
- [Routes](#routes)
- [Assets](#assets)
- [Services](#services)
- [Utilities](#utilities)
- [Entry Point](#entry-point)
- [State Management](#state-management)
- [API Communication](#api-communication)
- [Authentication Flow](#authentication-flow)
- [Folder Organization Principles](#folder-organization-principles)


---

# Project Overview

The client application is responsible for:

- Rendering the user interface
- Managing routing
- Authentication
- API communication
- State management
- Form validation
- User interactions

---

# Client Directory Structure

```text
client/
│
├── public/
├── src/
├── Dockerfile
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

# Source Directory

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

# Assets

Stores static resources.

Examples

- Images
- Icons
- Fonts

---

# Components

Reusable UI components.

Typical examples

- Navbar
- Footer
- Buttons
- Cards
- Modal
- Spinner
- Skeleton Loader

Each component should:

- Have a single responsibility
- Be reusable
- Avoid business logic

---

# Context

Contains global React Context providers.

Example

```text
AuthProvider.jsx
```

Responsibilities

- Firebase Authentication
- User Session
- Login
- Logout
- Current User
- Loading State

---

# Hooks

Contains reusable custom hooks.

## useAxios

Responsibilities

- Public API requests

---

## useAxiosSecure

Responsibilities

- JWT Injection
- Response Interceptor
- Automatic Logout
- Protected API Requests

---

## useAuth

Provides

- Current User
- Loading State
- Authentication Methods

---

## useRole

Returns

- User Role
- Loading State

---

# Layouts

Contains reusable page layouts.

Examples

- RootLayout
- Dashboard
- Authentication Layout

---

# Pages

Contains all page-level components.

Examples

- Home
- Login
- Register
- Public Lessons
- Lesson Details
- Dashboard
- Upgrade
- My Lessons
- Favorites
- Profile

---

# Routes

Contains application routing.

Responsibilities

- Route Configuration
- Nested Routes
- Protected Routes
- Admin Routes

---

# Services

Contains service integrations.

Examples

- Firebase Configuration
- API Services

---

# Utilities

Reusable helper functions.

Examples

- Date Formatting
- Validators
- Helper Functions

---

# Entry Point

```text
main.jsx
```

Responsibilities

- Render React
- Register Providers
- React Query
- Router
- Authentication

---

# State Management

The application uses

- React Context
- TanStack Query
- Local Component State

---

# API Communication

Two Axios instances are used.

Public

```
useAxios
```

Protected

```
useAxiosSecure
```

---

# Authentication Flow

Authentication is handled using Firebase Authentication.

Supported methods

- Google Login
- Email & Password

JWT tokens are automatically attached to secure requests.

---

# Folder Organization Principles

- Feature Separation
- Reusable Components
- Custom Hooks
- Clean Architecture
- Maintainability
- Scalability

---

# Related Documentation

- ARCHITECTURE.md
- PROJECT_STRUCTURE.md
- FEATURES.md
- SETUP.md