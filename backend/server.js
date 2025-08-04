const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Debug log for allowed frontend
console.log("Allowed Frontend URL:", process.env.FRONTEND_URL);

// Allowed origins (Netlify + localhost for dev)
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://charming-brioche-9c28c8.netlify.app",
  "http://localhost:5173"
];

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight requests globally
app.options("*", cors());

// Middleware to parse JSON
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// Mount routes (relative paths only)
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Fallback route for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
