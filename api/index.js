const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("../server/config/db");
const { NODE_ENV, CLIENT_ORIGIN } = require("../server/config/env");

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Required for serving static files from the same origin if using certain CDNs/assets
}));

app.use(
  cors({
    origin: NODE_ENV === "production" ? true : CLIENT_ORIGIN, // Allow all in production or specific origin
    credentials: true,
  })
);

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === "development" ? 2000 : 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Routes
const authRoutes = require("../server/routes/authRoutes");
const projectRoutes = require("../server/routes/projectRoutes");
const taskRoutes = require("../server/routes/taskRoutes");
const memberRoutes = require("../server/routes/memberRoutes");
const dashboardRoutes = require("../server/routes/dashboardRoutes");
const notificationRoutes = require("../server/routes/notificationRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/projects/:projectId/tasks", taskRoutes);
app.use("/api/v1/projects/:projectId/members", memberRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// SERVE STATIC FILES IN PRODUCTION
if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
  });
}

// Global Error Handler
const errorHandler = require("../server/middleware/errorHandler");
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
