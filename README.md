# Ethara-TaskFlow 🚀

Ethara-TaskFlow is a premium, full-stack SaaS-style Team Task Management application built with the MERN stack. It features a modern, high-fidelity user interface designed for efficiency, collaboration, and professional project tracking.


## ✨ Key Features

### 📋 Project & Task Management
- **Dynamic Kanban Board**: Seamlessly manage tasks across statuses (To Do, In Progress, Review, Completed) using an intuitive drag-and-drop interface powered by `@hello-pangea/dnd`.
- **Slide-Over Detail View**: View and edit task descriptions, update statuses, and manage assignments without leaving the board via a sleek interactive SlideOver component.
- **Task Analytics**: Real-time progress tracking for every project.

### 📊 Professional Dashboard
- **Visual Insights**: Interactive charts using **Recharts** to visualize task distribution and team performance.
- **Project Overview**: Quick access to active projects, pending tasks, and recent activity.

### 🔐 Security & Access Control
- **Role-Based Access (RBAC)**: Distinct permissions for **Admins** (full control) and **Members** (task-level access).
- **Secure Authentication**: JWT-based authentication with Access Tokens (in-memory) and Refresh Tokens (stored in `httpOnly` cookies) for maximum security.
- **Protected Routes**: Granular control over UI elements and API endpoints based on user roles.

### 🔔 Real-time Notifications
- **Engagement Alerts**: In-app notification bell to keep team members updated on task assignments and status changes.

### 🎨 Modern UI/UX
- **SaaS Aesthetics**: A premium design system featuring glassmorphism, smooth transitions, and a curated color palette using Tailwind CSS.
- **Fully Responsive**: Optimized for Desktop, Tablet, and Mobile devices.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: For a lightning-fast development experience and optimized production builds.
- **Tailwind CSS**: Utility-first CSS for the custom SaaS design system.
- **TanStack React Query (v5)**: Powerful asynchronous state management and data fetching.
- **React Hook Form & Zod**: Robust form handling and schema-based validation.
- **Lucide React**: Clean and consistent iconography.

### Backend
- **Node.js & Express**: Scalable and lightweight backend architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database with schema modeling.
- **Express-Validator**: Server-side request validation.
- **Helmet & Morgan**: Security headers and request logging.
- **Express-Rate-Limit**: Protection against brute-force attacks.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)

### 2. Clone the Repository
```bash
git clone https://github.com/Aman-Kumar778/Ethara-TaskFlow.git
cd Ethara-TaskFlow
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Security (Use 64-character random hex strings)
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Client Configuration
CLIENT_ORIGIN=http://localhost:5173
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Application
Start both the client and server concurrently:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000/api/v1`

---

## 🚀 Deployment on Railway

Ethara-TaskFlow is designed to be deployed as a single monorepo on Railway.

### Step 1: Prepare the Code
Ensure your `api/index.js` is configured to serve the static frontend files in production:
```javascript
if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
  });
}
```

### Step 2: Railway Configuration
1. Login to [Railway.app](https://railway.app/).
2. Create a **New Project** and select **Deploy from GitHub repo**.
3. Choose the `Ethara-TaskFlow` repository.

### Step 3: Set Variables
Add the following Environment Variables in the Railway dashboard:
- `MONGO_URI`: Your production MongoDB URI.
- `ACCESS_TOKEN_SECRET`: A secure random string.
- `REFRESH_TOKEN_SECRET`: A secure random string.
- `NODE_ENV`: `production`
- `PORT`: `5000` (Railway will automatically assign a port if preferred, but 5000 is default).

### Step 4: Build Command
Railway will detect the `package.json` in the root. The build process will:
1. Run `npm install`.
2. Run `npm run build` (This generates the `dist` folder via Vite).
3. Start the server using `npm start` (which runs `node api/index.js`).

---

## 📂 Project Structure
```text
Ethara-TaskFlow/
├── api/                # Server Entry Point (for Railway/Vercel)
├── server/             # Backend Source Code
│   ├── config/         # DB & Env configs
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── middleware/     # Auth & Error handlers
├── src/                # Frontend Source Code
│   ├── api/            # Axios API instances
│   ├── components/     # UI Components
│   ├── context/        # React Context (Auth)
│   ├── pages/          # Page Views
│   └── hooks/          # Custom React Hooks
├── public/             # Static assets
└── dist/               # Production build (generated)
```

## 🤝 Contributing
Developed by Aman Kumar
