# 🚀 NOPI (Nota Pintar)
> AI-powered financial management web application for Indonesian MSMEs.

---

## 📋 Table of Contents
- [Description](#-description)
- [Tech Stack](#-tech-stack)
- [Tools](#-tools)
- [Todos](#-todos)
- [Installation](#-installation)
- [Authors](#-authors)

---

## 📖 Description

**NOPI (Nota Pintar)** is an AI-powered financial management web application designed for Indonesian Micro, Small, and Medium Enterprises (MSMEs). This repository contains the Full-Stack implementation (Frontend and Backend) of the NOPI application.

The system is built as a Single Page Application (SPA) utilizing **React.js** for a seamless user interface and an **Express.js** backend for robust API handling. The backend is responsible for:

- 🔐 Secure user authentication (JWT & OAuth)
- 🗄️ Database management via Prisma ORM
- 🤖 Bridging to the external Machine Learning API (SVM-based) for receipt OCR extraction

The architecture is optimized for **serverless deployment** to ensure high availability and low latency.

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI Framework |
| Tailwind CSS | Styling |
| React Router DOM | Routing & Route Protection |
| Context API | Global State Management |
| Axios | HTTP Client |
| SweetAlert2 | Interactive UI Alerts |
| Google OAuth 2.0 | Social Authentication |

### Backend
| Technology | Purpose |
|---|---|
| Node.js & Express.js | Server & API Framework |
| Prisma ORM | Database Management |
| PostgreSQL / MySQL | Relational Database |
| JWT & bcrypt | Authentication & Security |
| Nodemailer | SMTP Email Service |

---

## ⚙️ Tools

| Tool | Usage |
|---|---|
| Git & GitHub | Version Control |
| Postman | API Testing |
| Visual Studio Code | Code Editor |
| npm / pnpm | Package Manager |
| Vercel | Deployment Platform |

---

## ✅ Todos

- [x] Initialize Project (Monorepo / Split Repo setup)
- [x] Install Dependencies
- [x] Create Express Server
- [x] Connect with Database (Prisma Setup)
- [x] Authentication with JWT
  - [x] Sign Up & Password Hashing
  - [x] Send Verification Email (Nodemailer)
  - [x] Token Verification (Middleware to Call API)
  - [x] Forgot & Reset Password Flow
  - [x] Google OAuth Integration
- [x] Users API
  - [x] Get User Details
  - [x] Setup & Update Business Profile
- [x] Nota (Receipt) API
  - [x] Connect with Cloud Storage for Image Upload
  - [x] Integrate Backend with ML OCR Endpoint
  - [x] Calculate Profit Margin Logic
  - [x] Save Scanned Receipt to Database
  - [x] Get Transaction History
  - [x] Get Detail Nota by ID
- [x] Frontend Development
  - [x] UI/UX Slicing with Tailwind CSS
  - [x] Implement Public and Protected Routes
  - [x] State Management (AuthContext)
  - [x] Handle Infinite Loop & Redirection Bugs
- [x] Deploy Backend API to Vercel (Serverless Functions)
- [x] Deploy Frontend to Vercel
- [x] Create Documentation

---

## 🚀 Installation

> **Prerequisites:** Make sure you have **Node.js** (v18+) and a package manager (**npm** or **pnpm**) installed on your machine.

### 1. Clone this repository

```bash
git clone https://github.com/your-username/nopi-fullstack.git
cd nopi-fullstack
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and fill in the following variables:

```env
PORT=5000
GOOGLE_CLIENT_ID="client_id"
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_jwt_secret"
EMAIL_USER="your_smtp_email"
EMAIL_PASS="your_smtp_password"
FRONTEND_URL="http://localhost:5173"
```

Synchronize Prisma schema with your database:

```bash
# Option 1 - Push schema directly
npx prisma db push

# Option 2 - Using migrations
npx prisma migrate dev
```

Run the backend server:

```bash
npm run dev
```

> Backend will run on `http://localhost:5000`

---

### 3. Setup Frontend

Open a **new terminal** window/tab:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL="http://localhost:5000"
```

Run the frontend development server:

```bash
npm run dev
```

> Frontend will be accessible at `http://localhost:5173`

---

## 👥 Authors

The Full-Stack Team behind NOPI:

**Daniswara Rizky** — *Full-Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](#)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](#)

**Dewi Ainun A.** — *Full-Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/dewiainun)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](#)
