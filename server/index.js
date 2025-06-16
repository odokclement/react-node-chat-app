import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const databaseUrl = process.env.MONGODB_DB_URL;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Debug logging
console.log("=== DEBUGGING INFO ===");
console.log("Port:", port);
console.log("Database URL exists:", !!databaseUrl);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Check if database URL exists before trying to connect
if (!databaseUrl) {
  console.error(" MONGODB_DB_URL is not defined in environment variables");
  console.error("Make sure you have MONGODB_DB_URL in your .env file");
  process.exit(1);
}

console.log(" Attempting to connect to MongoDB...");

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log(" Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error(" Error connecting to MongoDB:", error.message);
    console.error("Full error details:", error);
  });
