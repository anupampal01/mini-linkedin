const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Debug log
console.log("Allowed Frontend URL:", process.env.FRONTEND_URL);

// Allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://charming-brioche-9c28c8.netlify.app",
  "http://localhost:5173"
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Preflight
app.options("*", cors());

// Parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
