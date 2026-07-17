# Digital Life Lessons Platform

A comprehensive, production-grade community-driven repository for sharing real-life realisations, career insights, personal growth milestones, and mistakes learned. This platform moves beyond traditional academic education to focus on lived experiences, allowing users to publish, read, categorise, and react to life lessons.

---

## 1. Project Purpose

### Domain Objective
The **Digital Life Lessons** platform is a full-stack web application designed to facilitate the sharing of experiential wisdom. It provides a structured, interactive environment where users can document their personal growth, career lessons, relationship insights, and mindset shifts, creating a collaborative knowledge base of real-world experiences.

### Target User Groups
*   **Regular Users:** Registered members who can browse public lessons, search and filter content, save lessons to their favourites, comment on lessons, and report inappropriate content.
*   **Premium Subscribers:** Members who have upgraded via a one-time payment to enjoy unlimited access to premium-tier lessons, the ability to create premium lessons, and priority visibility.
*   **Administrators:** Platform moderators who manage user roles, oversee global lesson moderation, review flagged/reported content, and monitor platform growth metrics.

### Core Functional Pillars
*   **Wisdom Sharing & Moderation:** Dynamic creation, editing, soft-deletion, and reporting of lessons.
*   **Stripe Monetisation:** A secure, one-time payment flow to upgrade standard accounts to lifetime premium status.
*   **Admin Metrics & Analytics:** Visual charts tracking user registration and lesson creation trends over time.
*   **Dynamic Search & Filtering:** A multi-parametric search, category, and emotional tone filtering system with debounced inputs and pagination.

---

## 2. Architecture & Request Lifecycle

### End-to-End Request Lifecycle

#### 1. Frontend Network Flow
*   **Public Requests:** Handled via the `useAxios` hook, which uses a baseline Axios instance pointing to `VITE_API_URL`. No authentication headers are attached.
*   **Authenticated Requests:** Handled via the `useAxiosSecure` hook. When a user is logged in, this hook intercepts outgoing requests and injects the Firebase ID Token into the `Authorization` header as a Bearer token (`Bearer <token>`).
*   **Session Expiry / Revocation:** If the backend returns a `401` or `403` status code, the response interceptor in `useAxiosSecure` automatically triggers `logOut()` and redirects the user to `/login`.

#### 2. Monorepo Routing & Gateway Flow
*   **Client-Side Routing:** Managed by `Routes.jsx` using `createBrowserRouter`. It maps URLs to layouts (`RootLayout`, `AuthLayout`, `Dashboard`) and protects sensitive routes using `PrivateRoute` and `AdminRoute` wrappers.
*   **Backend Entry Point:** Requests land on `server/index.js`. Public routes are processed directly, while protected routes pass through the `verifyJWT` and `verifyADMIN` middleware chains.

#### 3. Express Middleware Chain
1.  **CORS Middleware:** Validates incoming origins against allowed domains (`http://localhost:5173`, Firebase hosting) and enables credentials.
2.  **Stripe Webhook Endpoint:** Placed *before* `express.json()` to receive raw payloads (`express.raw({ type: "application/json" })`) for signature verification.
3.  **Body Parser:** `express.json()` parses JSON payloads for all other routes.
4.  **Authentication Middleware (`verifyJWT`):** Extracts the Bearer token, verifies it using the Firebase Admin SDK, and attaches the decoded email to `req.tokenEmail`.
5.  **Authorisation Middleware (`verifyADMIN`):** Queries the database to verify if `req.tokenEmail` has an `admin` role.

### Authentication & Session Handshake Flow

