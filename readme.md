

# 🚀 Project Management System API

A robust **RESTful API** for project management, built with **Node.js, Express, TypeScript, and TypeORM**.

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#️-prerequisites)
- [Getting Started](#-getting-started)
  - [Docker Setup (Recommended)](#-docker-setup-recommended)
  - [Manual Setup](#-manual-setup)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
  - [Running Tests](#running-tests)
  - [Test Structure](#test-structure)
- [API Documentation](#-api-documentation)
  - [Postman & Swagger Documentation](#-swagger-documentation)
  - [Main Endpoints](#-main-endpoints)
    - [Authentication](#-authentication)
    - [User Management](#-user-management)
    - [Projects](#-projects)
    - [Tasks](#-tasks)
    - [Dashboard](#-dashboard)
    - [Search](#-search)
- [Development Tools](#-development-tools)
- [Error Handling](#️-error-handling)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [License](#-license)

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
- **Docker** (for containerized setup)

## 🚀 Getting Started

> **💡 Quick Tip**: If you're experiencing issues with git clone, you can download the project manually:
> 1. Go to the repository page
> 2. Click the green "Code" button
> 3. Select "Download ZIP"
> 4. Extract the ZIP file
> 5. Open terminal in the extracted folder
> 6. Continue with either Docker or Manual setup below

### 🐳 Docker Setup (Recommended)

1. **Get the code:**
   ```bash
   # Option 1: Clone the repository
   git clone https://github.com/petro-joseph/project-management-system.git
   cd project-management-system

   # Option 2: Manual download
   # After extracting the ZIP, navigate to the folder:
   cd path/to/project-management-system
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Launch with Docker:**
   ```bash
   # Start all services
   docker-compose up -d

   # Run migrations
   docker-compose exec api npm run migration:run

   # View logs
   docker-compose logs -f
   ```

4. **Access the services:**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api-docs
   - MailHog: http://localhost:8025

### 💻 Manual Setup

1. **Get the code:**
   ```bash
   # Option 1: Clone the repository
   git clone https://github.com/petro-joseph/project-management-system.git
   cd project-management-system

   # Option 2: Manual download
   # After extracting the ZIP, navigate to the folder:
   cd path/to/project-management-system
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

## 📂 Project Structure

```bash
src/
├── config/        # Configuration files
├── controllers/   # Route controllers
├── dto/           # Data Transfer Objects
├── entities/      # TypeORM entities
├── middleware/    # Custom middleware
├── migrations/    # Database migrations
├── routes/        # API routes
├── services/      # Business logic
├── test/          # Test files
└── utils/         # Utility functions
```

## ✅ Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e        # E2E tests

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

## 📑 API Documentation

### 📘 Swagger Documentation
Access Swagger UI: [**http://localhost:3000/api-docs**](http://localhost:3000/api-docs)

### 📮 Postman Collection
- Download the [Postman Collection](./postmanCollection.json)
- Import into Postman
- Collection includes:
  - All API endpoints
  - Environment variables
  - Example requests and responses
  - Authentication flows

### Environment Setup in Postman
1. Create a new environment in Postman
2. Set the following variables:
   ```
   BASE_URL: http://localhost:3000
   TOKEN: <your-auth-token>
   ```
3. Select the environment before making requests

### 🌐 Main Endpoints

#### 🔐 Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
POST /api/auth/logout   - Logout user
```

#### 👤 User Management
```
POST   /api/users        - Create user (Admin only)
GET    /api/users        - List users (Admin, Manager)
GET    /api/users/:id    - Get single user
PUT    /api/users/:id    - Update user (Admin only)
DELETE /api/users/:id    - Delete user (Admin only)
POST   /api/users/:id/role - Assign role (Admin only)
```

#### 📌 Projects
```
GET    /api/projects     - List projects
POST   /api/projects     - Create project (Manager/Admin)
GET    /api/projects/:id - Get project by ID
PUT    /api/projects/:id - Update project (Manager/Admin)
DELETE /api/projects/:id - Delete project (Manager/Admin)
```

#### 📝 Tasks
```
GET    /api/projects/:id/tasks - List tasks in a project
POST   /api/projects/:id/tasks - Create task (Manager)
PUT    /api/tasks/:id          - Update task
PATCH  /api/tasks/:id/status   - Change task status
DELETE /api/tasks/:id          - Delete task (Manager/Admin)
```

#### 📊 Dashboard
```
GET /api/dashboard/stats    - Get statistics (Admin/Manager)
GET /api/dashboard/progress - Get project progress (Admin/Manager)
```

#### 🔍 Search
```
GET /api/search/tasks?q={query}    - Search tasks
GET /api/search/projects?q={query} - Search projects
GET /api/search/users?q={query}    - Search users (Admin only)
```

## 📜 Available Scripts

```bash
npm run dev           # Start development server
npm run build        # Build for production
npm start           # Start production server
npm test            # Run tests
npm run migration:run # Run migrations
```

## ⚠️ Error Handling

The API follows standard HTTP status codes:

- `200` - Success ✅
- `201` - Created 🎉
- `400` - Bad Request ❌
- `401` - Unauthorized 🚫
- `403` - Forbidden ⛔
- `404` - Not Found 🔎
- `500` - Internal Server Error ⚠️

### Response Format

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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ by Petro Joseph Gati
</p>
