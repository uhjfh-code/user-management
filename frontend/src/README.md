# 🧩 User Management Application

A full-stack web-based **User Management System** with CRUD functionality — allowing you to create, read, update, and delete users.  
Built with **React**, **Node.js (Express)**, **PostgreSQL**, and fully containerized using **Docker Compose**.

---

## 🚀 Tech Stack

**Frontend**
- React + TypeScript  
- CSS Modules  
- Nginx (for production build)

**Backend**
- Node.js + Express  
- TypeScript + Prisma ORM  
- Zod (for input validation)

**Database**
- PostgreSQL 16 (Alpine)

**Containerization**
- Docker & Docker Compose

---

## 🗂️ Project Structure

```
USER-MANAGEMENT/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── users.ts          # User CRUD routes
│   │   ├── validators/
│   │   │   └── user.ts           # Zod validation schema
│   │   ├── prisma.ts             # Prisma client instance
│   │   └── index.ts              # Express app entry point
│   │
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Prisma migrations
│   │
│   ├── .env                      # Environment variables (ignored by git)
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── user_management.sql       # SQL dump of the database
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components (List, Add, Edit)
│   │   ├── styles/               # CSS styles (UserForm.css etc.)
│   │   ├── api.ts                # API communication
│   │   ├── App.tsx               # Main app component
│   │   ├── App.css
│   │   ├── index.tsx             # React entry point
│   │   └── index.css
│   │
│   ├── public/                   # Static assets
│   ├── Dockerfile
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml            # Multi-container setup (frontend, backend, db)
└── README.md
```

---

## ⚙️ Environment Variables

Backend `.env` file (in `/backend`):

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/user_management?schema=public"
PORT=4000
```

---

## 🐳 Run with Docker

Make sure you have **Docker** and **Docker Compose** installed.  
From the project root, run:

```bash
docker compose up --build
```

✅ This command will:
- Start a PostgreSQL database container  
- Build and run the backend (`Express + Prisma`)  
- Build and run the frontend (`React + Nginx`)  

---

## 🌍 Access the App

| Service | URL | Description |
|----------|-----|-------------|
| Frontend | [http://localhost:3000](http://localhost:3000) | React web application |
| Backend API | [http://localhost:4000/api/users](http://localhost:4000/api/users) | REST API endpoint |
| Health Check | [http://localhost:4000/api/users/status](http://localhost:4000/api/users/status) | Returns "User Management API is running!" |

---

## 🧪 Run Locally (without Docker)

If you prefer to run manually:

### 1️⃣ Start PostgreSQL locally
Make sure PostgreSQL is running and a database `user_management` exists.

### 2️⃣ Start Backend
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### 3️⃣ Start Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🧰 Features

✅ Create, view, edit, and delete users  
🔍 Search users by name, username, or email  
↕️ Sortable columns (customer number, name, etc.)  
🧾 Input validation using **Zod**  
🕒 Display of formatted **Last Login** date/time  
🎨 Modern responsive UI with CSS styling  

---

## 🧠 SQL Dump

You can restore the database manually if needed:
```bash
psql -U postgres -d user_management -f backend/user_management.sql
```

---

## 🏁 Stop the App

To stop and remove all containers:
```bash
docker compose down
```

---

## 👩‍💻 Author

**Anna Qiu**  
📧 [annaqiu06@gmail.com](mailto:annaqiu06@gmail.com)