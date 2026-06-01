# 🚀 NOPI (Nota Pintar) - Full-Stack Application

## 1. Description
**NOPI (Nota Pintar)** is an AI-powered financial management web application designed for Indonesian Micro, Small, and Medium Enterprises (MSMEs). This repository contains the Full-Stack implementation (Frontend and Backend) of the NOPI application. 

The system is built as a Single Page Application (SPA) utilizing React.js for a seamless user interface and an Express.js backend for robust API handling. The backend is responsible for secure user authentication (JWT & OAuth), database management via Prisma ORM, and acting as a bridge to consume the external Machine Learning API (Support Vector Machine based) for receipt OCR extraction. The architecture is optimized for serverless deployment to ensure high availability and low latency.

## 2. Table of Contents
- [Description](#1-description)
- [Table of Contents](#2-table-of-contents)
- [Tech Stack](#3-tech-stack)
- [Tools](#4-tools)
- [Todos](#5-todos)
- [Installation](#6-installation)
- [Authors](#7-authors)

## 3. Tech Stack
**Frontend Environment:**
- React.js (built with Vite)
- Tailwind CSS (Styling)
- React Router DOM (Routing & Protection)
- Context API (Global State Management)
- Axios (HTTP Client)
- SweetAlert2 (Interactive UI Alerts)
- Google OAuth 2.0

**Backend Environment:**
- Node.js & Express.js
- Prisma ORM (Database Management)
- PostgreSQL / MySQL (Relational Database)
- JSON Web Token (JWT) & bcrypt (Security)
- Nodemailer (SMTP Email Service)

## 4. Tools
- **Version Control:** Git & GitHub
- **API Client:** Postman
- **Code Editor:** Visual Studio Code
- **Package Manager:** npm / pnpm
- **Deployment Platform:** Vercel

## 5. Todos
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


## 6. Installation

### Run on Local Environment
Make sure you have **Node.js** (v18+) and a package manager (**npm** or **pnpm**) installed on your machine.

**1. Clone this repository**
```bash
git clone [https://github.com/your-username/nopi-fullstack.git](https://github.com/your-username/nopi-fullstack.git)
cd nopi-fullstack```
2. Setup Backend

Bash
cd backend
npm install

# Setup Environment Variables
# Create a .env file in the backend folder and provide the following keys:
# DATABASE_URL="your_database_connection_string"
# JWT_SECRET="your_jwt_secret"
# EMAIL_USER="your_smtp_email"
# EMAIL_PASS="your_smtp_password"
# FRONTEND_URL="http://localhost:5173"

# Synchronize Prisma schema with your database
npx prisma db push
# or if using migrations: npx prisma migrate dev

# Run the backend server
npm run dev
The backend server will run on http://localhost:5000

3. Setup Frontend
Open a new terminal window/tab:

Bash
cd frontend
npm install

# Setup Environment Variables
# Create a .env file in the frontend folder:
# VITE_API_URL="http://localhost:5000"

# Run the frontend development server
npm run dev
The frontend application will be accessible at http://localhost:5173


## 7. Authors

> **The Full-Stack Team behind NOPI**

👤 **Daniswara Rizky** — *Full-Stack Developer*  
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](#) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](#)

👤 **Dewi Ainun A.** — *Full-Stack Developer*  
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](#) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](#)
