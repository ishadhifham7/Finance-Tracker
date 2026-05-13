# Personal Finance & Budget Tracking Application

A modern full-stack finance management application that helps users track income, expenses, budgets, and financial insights through an interactive dashboard.

The system is built using scalable backend architecture, secure Firebase authentication, MongoDB aggregation-based analytics, and a modern React dashboard UI.

---

# Features

## Authentication
- Firebase Authentication
- Secure JWT token verification
- Protected API routes
- User-scoped data isolation

## Transaction Management
- Add transactions
- Edit transactions
- Delete transactions
- Advanced filtering & searching
- Pagination & sorting

## Category Management
- Create custom categories
- Category color system
- User-scoped categories
- Safe category deletion handling

## Budget Management
- Monthly category-based budgets
- Real-time budget progress tracking
- Overspending indicators
- Budget analytics

## Dashboard Analytics
- Monthly income vs expense trends
- Expense distribution by category
- Financial summary cards
- Recent transactions overview
- Budget progress visualization

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Authentication | Firebase Authentication |
| Styling | TailwindCSS |
| Charts | Recharts |

---

# System Architecture

```text
Frontend (React + TypeScript)
        ↓
REST API (Node.js + Express)
        ↓
MongoDB Database
        ↓
Firebase Authentication
```

The frontend communicates with the backend through protected REST APIs. Firebase handles authentication and JWT token generation, while MongoDB manages all application data and analytics.

---

# Project Structure

```text
frontend/
backend/
```

---

# Backend Setup

## 1. Navigate to backend

```bash
cd backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create environment file

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://ishadhifham_db_user:0CfFJazyktnBZIGa@cluster0.bkltdl1.mongodb.net/?appName=Cluster0
FIREBASE_SERVICE_ACCOUNT_PATH=./src/config/serviceAccountKey.json
```

## 4. Run backend server

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

# Frontend Setup

## 1. Navigate to frontend

```bash
cd frontend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create environment file

Create a `.env` file inside the frontend folder.

Example:

```env
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=AIzaSyDwa2quSDneZwWqy1TKPwFodu0SqeL1oFI
VITE_FIREBASE_AUTH_DOMAIN=finance-tracker-b73bc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=finance-tracker-b73bc
VITE_FIREBASE_STORAGE_BUCKET=finance-tracker-b73bc.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1003823371143
VITE_FIREBASE_APP_ID=1:1003823371143:web:b5bdfd56f6ea90f6d97922

# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

## 4. Run frontend

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# API Overview

## Authentication
- Firebase JWT-based authentication
- Protected routes using middleware verification

## Transactions
- Create transaction
- Update transaction
- Delete transaction
- Filter & search transactions
- Monthly trend analytics

## Categories
- Create category
- Edit category
- Delete category
- Category-based organization

## Budgets
- Allocate monthly budgets
- Track spending progress
- Overspending detection

---

# Dashboard Analytics

The dashboard is powered using MongoDB aggregation pipelines.

Analytics include:
- Monthly income vs expense trends
- Expense distribution by category
- Financial summaries
- Budget progress calculations

All analytics are generated dynamically from transaction data in real time.

---

# Authentication Flow

1. User signs in using Firebase Authentication
2. Firebase generates a secure JWT token
3. Frontend attaches token to API requests
4. Backend verifies token using Firebase Admin SDK
5. Authenticated user data is scoped securely using MongoDB userId

Passwords are never stored in the application database.

---

# Database Design

## Main Entities

### User
Stores Firebase-linked user information.

### Transaction
Stores income and expense records.

### Category
Used to organize financial transactions.

### Budget
Tracks monthly spending limits per category.

---

# Important Engineering Decisions

- Aggregation-driven analytics
- Compound MongoDB indexing
- Modular backend architecture
- Service/controller separation
- Zod request validation
- User-scoped security model
- Nullable category handling for transaction preservation

---

# Future Improvements

- AI-based financial insights
- Recurring transactions
- Export reports (PDF/Excel)
- Notification system
- Mobile application support
- Predictive budgeting analytics

---

# Author

Ishadh Ifham
