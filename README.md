# Team Task Manager

A full-stack MERN application for managing team projects and tasks, designed for deployment on Vercel with MongoDB Atlas.

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT
- **Frontend**: React (Vite), Tailwind CSS v3, Axios, TanStack React Query v5
- **Auth**: JWT with access tokens in memory and refresh tokens in httpOnly cookies
- **Hosting**: Vercel (Monorepo)

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account

### 2. Setup Environment Variables
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
ACCESS_TOKEN_SECRET=your_random_64_char_hex
REFRESH_TOKEN_SECRET=your_random_64_char_hex
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

## Deployment on Vercel

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Configure the following environment variables in Vercel:
   - `MONGO_URI`
   - `ACCESS_TOKEN_SECRET`
   - `REFRESH_TOKEN_SECRET`
   - `CLIENT_ORIGIN` (Your Vercel deployment URL)
   - `NODE_ENV=production`
   - `VITE_API_URL=/api/v1`
4. Click Deploy.

## Features
- **Project Management**: Create, update, and delete projects.
- **Task Management**: Kanban board with drag-and-drop, task table, and status tracking.
- **Role-Based Access Control**: Admin and Member roles with specific permissions.
- **Real-time Stats**: Project and user-level dashboard statistics.
- **Notifications**: Alerts for task assignments and status updates.
- **Responsive Design**: Fully functional on mobile, tablet, and desktop.
