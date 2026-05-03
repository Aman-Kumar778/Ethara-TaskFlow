const dotenv = require("dotenv");
dotenv.config();

const requiredEnvs = [
  "MONGO_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];

// In production, CLIENT_ORIGIN is optional if serving from the same host
if (process.env.NODE_ENV !== "production") {
  requiredEnvs.push("CLIENT_ORIGIN");
}

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  PORT: process.env.PORT || 5000,
};
