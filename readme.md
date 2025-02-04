Sure! Here’s a well-structured `README.md` with markdown formatting and emojis to make it more engaging:  

---

# 🚀 Project Management System API  

A **RESTful API** for project management, built with **Node.js**, **Express**, **TypeScript**, and **TypeORM**.  

## ✨ Features  

- 🔐 **JWT Authentication & Role-Based Access Control**  
- 📊 **Project & Task Management**  
- 🔍 **Advanced Search Functionality**  
- 📧 **Email Notifications**  
- 🚀 **Real-time Updates**  
- 📝 **Comprehensive API Documentation**  
- 🗄️ **PostgreSQL Database**  
- 💾 **Redis Caching**  
- 🐳 **Docker Containerization**  
- ✅ **Automated Testing**  

## 🛠 Tech Stack  

- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** PostgreSQL, TypeORM  
- **Caching:** Redis  
- **Containerization:** Docker & Docker Compose  
- **Testing:** Jest, Supertest  
- **Documentation:** Swagger / OpenAPI  

---

## ⚡ Prerequisites  

Ensure you have the following installed:  

- **Node.js** (v16+)  
- **Docker & Docker Compose**  
- **PostgreSQL**  
- **Redis**  

---

## 🚀 Quick Start  

### 1️⃣ Clone the repository  

```bash
git clone https://github.com/yourusername/project-management-api.git
cd project-management-api
```

### 2️⃣ Install dependencies  

```bash
npm install
```

### 3️⃣ Set up environment variables  

```bash
cp .env.example .env
```

### 4️⃣ Start with Docker  

```bash
docker-compose up
```

The API will be available at **[http://localhost:3000](http://localhost:3000)** 🚀  

---

## 🔧 Development  

### Start the development server  

```bash
npm run dev
```

### Run tests  

```bash
npm test
```

### Generate migrations  

```bash
npm run migration:generate
```

### Run migrations  

```bash
npm run migration:run
```

---

## 📖 API Documentation  

Swagger documentation is available at:  
📌 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**  

---

## 🔑 Environment Variables  

```ini
# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=project_management

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-username
SMTP_PASS=your-password
```

---

## 🐳 Docker Support  

### Build and run with Docker  

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up

# Testing
docker-compose -f docker-compose.test.yml up
```

---

## 📡 API Endpoints  

### 🔐 Authentication  

- `POST /api/auth/register` - Register new user  
- `POST /api/auth/login` - Login user  
- `POST /api/auth/logout` - Logout user  

### 📁 Projects  

- `GET /api/projects` - Get all projects  
- `POST /api/projects` - Create project  
- `GET /api/projects/:id` - Get project by ID  
- `PUT /api/projects/:id` - Update project  
- `DELETE /api/projects/:id` - Delete project  

### ✅ Tasks  

- `GET /api/projects/:id/tasks` - Get project tasks  
- `POST /api/projects/:id/tasks` - Create task  
- `PUT /api/tasks/:id` - Update task  
- `PATCH /api/tasks/:id/status` - Update task status  
- `DELETE /api/tasks/:id` - Delete task  

### 🔍 Search  

- `GET /api/search/tasks` - Search tasks  
- `GET /api/search/projects` - Search projects  
- `GET /api/search/users` - Search users (Admin only)  

---

## 📂 Project Structure  

```bash
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── entities/       # TypeORM entities
├── middleware/     # Custom middleware
├── migrations/     # Database migrations
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── test/           # Test files
```

---

## 🧪 Testing  

Run different types of tests:  

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

---

## 🗄️ Database Migrations  

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

---

## 📜 Available Scripts  

```bash
npm start            # Start production server
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run tests
npm run docker:dev   # Run development Docker environment
npm run docker:test  # Run tests in Docker
```

---

## ❗ Error Handling  

The API uses the following error codes:  

- `200` - Success ✅  
- `201` - Created 🎉  
- `400` - Bad Request ❌  
- `401` - Unauthorized 🚫  
- `403` - Forbidden 🔒  
- `404` - Not Found 🔎  
- `500` - Internal Server Error 🔥  

### Response Format  

✅ **Success Response**  

```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

❌ **Error Response**  

```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## 🛠 Development Tools  

### 📌 Database Management  

Access **pgAdmin**: [http://localhost:5050](http://localhost:5050)  
**Email:** `admin@admin.com`  
**Password:** `admin`  

### 📧 Email Testing  

Access **MailHog**: [http://localhost:8025](http://localhost:8025)  

---

## 🚀 Deployment  

### Using Docker (Production)  

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment  

```bash
npm run build
npm start
```

---

## 🔒 Security  

- 🔑 **JWT Authentication**  
- 🔓 **Role-Based Access Control**  
- 🛡 **Input Validation**  
- 🏴‍☠️ **SQL Injection Protection**  

---
