# Digital Life Lessons Platform

A comprehensive, production-grade community-driven repository for sharing real-life realisations, career insights, personal growth milestones, and mistakes learned. This platform moves beyond traditional academic education to focus on lived experiences, allowing users to publish, read, categorise, and react to life lessons.

---

## 1. Project Purpose & Core Architecture

### Platform Summary
The **Digital Life Lessons** platform is a full-stack web application designed to facilitate the sharing of experiential wisdom. It provides a structured, interactive environment where users can document their personal growth, career lessons, relationship insights, and mindset shifts, creating a collaborative knowledge base of real-world experiences.

#### Target User Personas
*   **Regular Users:** Registered members who can browse public lessons, search and filter content, save lessons to their favourites, comment on lessons, and report inappropriate content.
*   **Premium Subscribers:** Members who have upgraded via a one-time payment to enjoy unlimited access to premium-tier lessons, the ability to create premium lessons, and priority visibility.
*   **Administrators:** Platform moderators who manage user roles, oversee global lesson moderation, review flagged/reported content, and monitor platform growth metrics.

#### Core Feature Pillars
*   **Wisdom Sharing & Moderation:** Dynamic creation, editing, soft-deletion, and reporting of lessons.
*   **Stripe Monetisation:** A secure, one-time payment flow to upgrade standard accounts to lifetime premium status.
*   **Admin Metrics & Analytics:** Visual charts tracking user registration and lesson creation trends over time.
*   **Dynamic Search & Filtering:** A multi-parametric search, category, and emotional tone filtering system with debounced inputs and pagination.

---

### Monorepo Data Flow & Request Lifecycle

The application operates on a decoupled client-server architecture with a unified request lifecycle:

