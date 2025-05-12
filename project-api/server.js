// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const globals = require("./configs/globals");
const playerRouter = require("./routes/players");
const authRouter = require("./routes/index");
const highlightRouter = require("./routes/highlights");
const Admin = require("./models/admin");

dotenv.config();

const app = express();

// ─────────────────────────────────────────────
// 1. CORS + Security Middleware
// ─────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "https://boozybearsstattracker.web.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 Incoming request from origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("🚫 Origin not allowed by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// 2. Sessions & Passport
// ─────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === "production";
console.log("🔧 Environment:", process.env.NODE_ENV);
console.log("🍪 Cookie Settings → secure:", isProduction, "| sameSite:", isProduction ? "none" : "lax");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: globals.ConnectionString.MongoDB,
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

app.use((req, res, next) => {
  if (req.session) {
    console.log("🧩 Session middleware initialized.");
    console.log("📦 Session ID:", req.sessionID);
  } else {
    console.warn("⚠️ Session not initialized.");
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// ─────────────────────────────────────────────
// 3. MongoDB Connection (no deprecated opts)
// ─────────────────────────────────────────────
mongoose
  .connect(globals.ConnectionString.MongoDB)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ─────────────────────────────────────────────
// 4. Routes
// ─────────────────────────────────────────────
app.use("/players", playerRouter);
app.use("/", authRouter);
app.use("/api/videos", highlightRouter);

app.get("/auth/status", (req, res) => {
  console.log("🔐 /auth/status — isAuthenticated:", req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.status(200).json({ message: "Authenticated" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/", (req, res) => {
  res.send("🏒 Men's League Hockey Stats API is live");
});

// ─────────────────────────────────────────────
// 5. Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
