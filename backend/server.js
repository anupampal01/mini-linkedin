const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();
connectDB();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Log allowed frontend URL (for debugging on Render logs)
console.log("Allowed Frontend URL:", process.env.FRONTEND_URL);

// Allowed origins (Netlify + Localhost for development)
const allowedOrigins = [
  process.env.FRONTEND_URL,      // From .env (Netlify URL)
  "http://localhost:5173"        // Local dev
];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/authorization headers
  })
);

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
