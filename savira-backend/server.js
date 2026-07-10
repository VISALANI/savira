const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

const app = express();

// ── Security headers
app.use(helmet());

// ── CORS — accept requests from Vercel frontend and localhost
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "https://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, etc.)
    if (!origin) return callback(null, true);
    // Allow any Vercel subdomain for the savira project
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/savira.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    console.warn(`CORS blocked: ${origin}`);
    return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle preflight requests
app.options("*", cors());

// ── Global rate limit
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// ── Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Sanitize MongoDB query injection
app.use(mongoSanitize());

// ── Logging — always on so production errors are visible in Render logs
app.use(morgan("combined"));

// ── Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/coupons", require("./routes/coupons"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/upload", require("./routes/upload"));

// ── Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", brand: "SAVIRA ATTIRES" }));

// ── 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ── Connect DB & start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 SAVIRA API running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
