const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();
connectDB();
app.use(cors());


const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Log for debugging
console.log("Allowed Frontend URL:", process.env.FRONTEND_URL);

// Allowed origins (Netlify + localhost for dev)
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://charming-brioche-9c28c8.netlify.app",
  "http://localhost:5173"
];

// Allow only your Netlify domain
app.use(cors({
  origin: 'https://charming-brioche-9c28c8.netlify.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Handle preflight requests globally
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
