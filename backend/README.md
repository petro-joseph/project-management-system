# 🛠️ Backend Service - Project Management System

Welcome to the **Backend API** powering the Project Management System! This service handles all data, authentication, and business logic. It can run **standalone** or as part of the **full-stack platform**. 🚀

---

## 🧩 How this Backend Fits In

- Provides RESTful API endpoints for the frontend and other services.
- Manages users, projects, tasks, assets, and more.
- Connects to **PostgreSQL** for data storage.
- Uses **Redis** for caching and async workflows.
- When running the **full system via Docker Compose**, it integrates with all components seamlessly.

For full system setup, **see the root [README](../readme.md)**.

---

## ⚙️ Tech Stack

- 🟢 **Node.js + Express** — Fast, scalable API server
- 🟦 **TypeScript** — Type safety
- 🗄️ **PostgreSQL** — Relational database
- 🧠 **Redis** — Caching and async processing
- 🗃️ **TypeORM** — Elegant ORM
- 🧪 **Jest** — Testing framework
- 📄 **Swagger** — API documentation

---

## 🐳 Running as Part of the Full System (Recommended)

Spin up everything with Docker Compose:

```bash
git clone https://github.com/petro-joseph/project-management-system.git
cd project-management-system
cp backend/.env.example backend/.env
docker-compose up -d
```

- Backend API: [http://localhost:3001](http://localhost:3001)
- Swagger Docs: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- Database, Redis, NGINX, and frontend will all be connected automatically! 🎉

---

## 💻 Running Backend Standalone (Local Dev)

### Prerequisites

- **Node.js** v16+
- **npm**
- **PostgreSQL** running locally
- **Redis** running locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/petro-joseph/project-management-system.git
cd project-management-system/backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Copy the example env file and update as needed:

```bash
cp .env.example .env
```

Set your database, Redis, and JWT secrets.

### 4️⃣ Set up the database

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE project_management;"
```

Run migrations:

```bash
npm run migration:run
```

### 5️⃣ Start the backend server

```bash
npm run dev
```

API will be live at [http://localhost:3001](http://localhost:3001) 🚀

---

## 🧪 Testing

Run tests with:

```bash
npm test
```

---

## 📄 API Documentation

Interactive docs available at:

[http://localhost:3001/api/docs](http://localhost:3001/api/docs)

Or use the Postman collection in `backend/postmanCollection.json`.

---

## 🌍 Deployment

- Use Docker Compose for production deployment.
- Or build and run standalone:

```bash
npm run build
npm start
```

---

## 🤝 Contributing

We welcome contributions! Check the root [README](../readme.md) for guidelines.

---

## 📄 License

MIT License © 2025 Petro Joseph Gati

---

Happy coding! 💻✨