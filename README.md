User Management System
======================

A fully containerized full-stack CRUD project (React + Node.js + PostgreSQL + Docker Compose).  
Just unzip and run a few commands to start everything.

------------------------------------------------------------
1. Prerequisites
------------------------------------------------------------
- Docker and Docker Compose installed
- Terminal (macOS/Linux) or PowerShell (Windows)

------------------------------------------------------------
2. Quick Start
------------------------------------------------------------
1. Enter the project directory
   cd user-management

2. Copy the environment variable template
   For macOS / Linux:
      cp backend/.env.example backend/.env
   For Windows (PowerShell):
      Copy-Item backend/.env.example backend/.env

3. Start all services
   docker-compose up --build

   👉 During the first startup, Prisma will automatically create database tables
   using the migration files in `backend/prisma/migrations/`.

4. Open your browser:
   Frontend:  http://localhost:3000
   Backend:   http://localhost:4000/api/users


All services will start automatically:
- PostgreSQL database
- Node.js backend (API)
- React frontend

------------------------------------------------------------
3. Project Structure
------------------------------------------------------------
user-management/
├── backend/
│   ├── src/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │       └── 20251102_init/
│   │           └── migration.sql
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.txt

------------------------------------------------------------
4. Environment Variables
------------------------------------------------------------
backend/.env.example example content:

DATABASE_URL="postgresql://postgres:postgres@db:5432/user_management?schema=public"
JWT_SECRET="change_this_secret"
PORT=4000
NODE_ENV=production

Do NOT share your real .env file.  
The .env.example file is a safe template — others can copy it to create their own `.env`.

------------------------------------------------------------
5. Docker Services
------------------------------------------------------------
Service   | Host Port | Container Port | Description
----------------------------------------------------
frontend  | 3000      | 80             | React frontend
backend   | 4000      | 4000           | Node.js API
db        | 5435      | 5432           | PostgreSQL database

Internal container communication:
- backend → db:5432
- frontend → backend:4000

External access (from your host machine):
- You can connect to the database using `localhost:5435`
  e.g. postgresql://postgres:postgres@localhost:5435/user_management?schema=public

------------------------------------------------------------
6. Common Issues
------------------------------------------------------------

(1) Port already in use  
Error: port is already allocated  
Fix: change database port in docker-compose.yml to "5436:5432"  
or stop your local PostgreSQL service.

(2) Prisma error “Missing DATABASE_URL”  
Add these lines in your Dockerfile:
ENV DATABASE_URL="postgresql://placeholder@localhost:5432/db?schema=public"
RUN npx prisma generate

(3) Database connection failed (HTTP 500)  
Ensure your `.env` uses `db` as host name instead of `localhost`:
DATABASE_URL="postgresql://postgres:postgres@db:5432/user_management?schema=public"

(4) Tables not created / "relation User does not exist"  
Make sure you have the folder `backend/prisma/migrations/` included in your zip.  
The backend automatically runs:
   npx prisma migrate deploy
during startup to apply migrations and create all tables.

------------------------------------------------------------
7. Stop and Clean Containers
------------------------------------------------------------
docker-compose down -v

------------------------------------------------------------
8. Author / License
------------------------------------------------------------
Author: Anna Qiu  
Email: annaqiu06@gmail.com  
License: MIT  
You may freely modify and use this project for learning, demos, or hiring tests.

------------------------------------------------------------
Summary
------------------------------------------------------------
Unzip → copy env file → docker-compose up --build  
and the system is ready to use 🚀
