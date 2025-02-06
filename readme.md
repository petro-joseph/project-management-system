```markdown
#  Project Management System API

A  **RESTful API** for project management, built with **Node.js, Express, TypeScript, and TypeORM**.

## 📖 Overview

This API provides the following project management functionalities:

- ✅ **User Authentication & Role-Based Access Control**
- 📂 **Project & Task Management**
- 🔍 **Search Functionality**
- 📧 **Email Notifications**
- 🧪 **Automated Testing**
- 📑 **API Documentation (Swagger & Postman)**

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL, TypeORM
- **Caching:** Redis
- **Testing:** Jest, Supertest
- **Documentation:** Swagger & Postman Collection
- **Containerization:** Docker & Docker Compose

## ⚙️ Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+)
- **PostgreSQL**
- **Redis**
- **Docker** (optional)

---

## 🚀 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/petro-joseph/project-management-system.git
   cd project-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Create database:**
   ```bash
   psql -U postgres
   CREATE DATABASE project_management;
   ```

5. **Run migrations:**
   ```bash
   npm run migration:run
   ```

6. **Start the server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

---

## 📂 Project Structure

```bash
src/
├── config/        # Configuration files
├── controllers/   # Route controllers
├── dto/           # data Transfer Object
├── entities/      # TypeORM entities
├── middleware/    # Custom middleware
├── migrations/    # Database migrations
├── routes/        # API routes
├── services/      # Business logic
├── test/          # Test files
└── utils/         # Utility functions
```

---

## ✅ Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e         # E2E tests

# Run with coverage
npm run test:coverage
```

### Test Structure

```bash
src/test/
├── unit/          # Unit tests
├── integration/   # Integration tests
├── e2e/           # End-to-end tests
├── setup.ts       # Test setup
└── helpers.ts     # Test helpers
```

---

## 📑 API Documentation

### 📘 Swagger Documentation
Access Swagger UI: [**http://localhost:3000/api-docs**](http://localhost:3000/api-docs)

### 📌 Postman Collection
Import the [Postman Collection](postmanCollection.json) to test API endpoints.

### 🌐 Main Endpoints

#### 🔐 Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
POST /api/auth/logout - Logout user
```

#### 👤 User Management
```
POST /api/users - Create user (Admin only)
GET /api/users - List users (Admin, Manager)
GET /api/users/:id - Get single user
PUT /api/users/:id - Update user (Admin only)
DELETE /api/users/:id - Delete user (Admin only)
POST /api/users/:id/role - Assign role (Admin only)
```

#### 📌 Projects
```
GET /api/projects - List projects
POST /api/projects - Create project (Manager/Admin)
GET /api/projects/:id - Get project by ID
PUT /api/projects/:id - Update project (Manager/Admin)
DELETE /api/projects/:id - Delete project (Manager/Admin)
```

#### 📝 Tasks
```
GET /api/projects/:id/tasks - List tasks in a project
POST /api/projects/:id/tasks - Create task (Manager)
PUT /api/tasks/:id - Update task
PATCH /api/tasks/:id/status - Change task status
DELETE /api/tasks/:id - Delete task (Manager/Admin)
```

#### 📊 Dashboard
```
GET /api/dashboard/stats - Get statistics (Admin/Manager)
GET /api/dashboard/progress - Get project progress (Admin/Manager)
```

#### 🔍 Search
```
GET /api/search/tasks?q={query} - Search tasks
GET /api/search/projects?q={query} - Search projects
GET /api/search/users?q={query} - Search users (Admin only)
```

All endpoints support pagination using `page` and `limit` query parameters:
```
GET /api/projects?page=1&limit=10
GET /api/search/tasks?q=test&page=1&limit=10
```

---

## 🐳 Docker Support

```bash
# Start development containers
docker-compose up

# Run tests in containers
docker-compose -f docker-compose.test.yml up
```

---

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm test            # Run tests
npm run migration:run # Run migrations
```

---

## 🛠 Development Tools

### 📌 Database Management (If you are using docker)
- Access **pgAdmin**: [**http://localhost:5050**](http://localhost:5050)
- Credentials:
  - **Email:** `admin@admin.com`
  - **Password:** `admin`

### 📧 Email Testing (If you are using docker)
- Access **MailHog**: [**http://localhost:8025**](http://localhost:8025)

---

## ⚠️ Error Handling

The API follows standard HTTP status codes:

- `200` - Success ✅
- `201` - Created 🎉
- `400` - Bad Request ❌
- `401` - Unauthorized 🚫
- `403` - Forbidden ⛔
- `404` - Not Found 🔎
- `500` - Internal Server Error ⚠️

### 📝 Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

