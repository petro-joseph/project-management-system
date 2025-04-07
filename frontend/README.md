# 🚀 Project Frontend

Welcome to the **Project Management System Frontend**! This is a modern React application built with Vite, designed to work **both as a standalone app** and **as part of the full-stack project management platform**. Let's build something amazing! ✨

---

## 🧩 How this Frontend Fits In

- Can run **independently** for UI development and testing.
- Integrates seamlessly with the **Node.js + PostgreSQL backend**.
- Communicates with the backend API (default: `http://localhost:3001`).
- When running the **full system via Docker Compose**, the frontend is automatically connected to all services.

For full system setup, **check the root [README](../readme.md)** for architecture, Docker instructions, and service details.

---

## 🛠️ Tech Stack

- ⚡ **Vite** — Fast build tool and dev server
- ⚛️ **React** — UI library
- 🟦 **TypeScript** — Typed JavaScript
- 🎨 **Tailwind CSS** — Utility-first CSS
- 🧩 **shadcn/ui** — Beautiful UI components

---

## 🐳 Running as Part of the Full System (Recommended)

The easiest way to run the entire platform is with Docker Compose:

```bash
git clone https://github.com/petro-joseph/project-management-system.git
cd project-management-system
cp backend/.env.example backend/.env
docker-compose up -d
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Swagger Docs: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

This will spin up **frontend, backend, database, Redis, NGINX, and monitoring tools** all connected together! 🎉

---

## 💻 Running Frontend Standalone (Local Dev)

You can also run just the frontend for UI development.

### Prerequisites

- **Node.js** v16+
- **npm**

### 1️⃣ Clone the repository

```bash
git clone https://github.com/petro-joseph/project-management-system.git
cd project-management-system/frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure API URL (optional)

By default, the frontend expects the backend at `http://localhost:3001`. To change this, update your environment variables or API config in `frontend/src/lib/api.ts`.

### 4️⃣ Start the development server

```bash
npm run dev
```
### ℹ️ Development Server Details

When you run `npm run dev`, the Vite development server starts and serves your React app with hot module replacement.

- **Local URL:** [http://localhost:3000](http://localhost:3000) — open this on your development machine.
- **Network URLs:** e.g., `http://192.168.x.x:3000` or `http://172.x.x.x:3000` — these allow other devices on your local network (phone, tablet, other PCs) to access the app.

**What do these network IPs mean?**

They correspond to your computer's private IP addresses on different network interfaces (Wi-Fi, Ethernet, Docker, VPN, etc.). They are only accessible within your local network.

**Customizing port and host:**

- Default port is **3000** .
- You can change this in `vite.config.ts`, `.env` files, or by CLI flags:

```bash
npm run dev -- --port=3000 --host=0.0.0.0
```

Setting `host` to `0.0.0.0` exposes the server on all network interfaces, enabling access from other devices.


Visit [http://localhost:3000](http://localhost:3000) to see the app running! 🌐

---

## 🏗️ Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy 🚀

---

## 🌍 Deployment Options

- **Standalone**: Deploy the `dist/` folder to Vercel, Netlify, or any static host.
- **Integrated**: Use Docker Compose for full-stack deployment.

---

## 🤝 Contributing

We welcome contributions! Check the root [README](../readme.md) for guidelines.

---

## 📄 License

MIT License © 2025 Petro Joseph Gati

---

Happy coding! 💻✨
