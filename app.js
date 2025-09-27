// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");

const mainRouter = require("./routes");
const { INTERNAL_SERVER_ERROR } = require("./utils/errors");

const app = express();

const {
  PORT = 3000, // ✅ local default; Render PORT'u env'den verir
  MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db", // ✅ Atlas için env
  FRONTEND_URL = "https://eray02dev.github.io", // ✅ canlı frontend (GitHub Pages)
  FRONTEND_URL_2, // opsiyonel ikinci domain
} = process.env;

// --- DB ---
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected")) // eslint-disable-line no-console
  .catch((err) => console.error("MongoDB error:", err)); // eslint-disable-line no-console

// --- Security & Parsers ---
app.use(helmet());
app.use(express.json());

// --- CORS (whitelist + credentials) ---
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  FRONTEND_URL,
  FRONTEND_URL_2,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // origin yoksa (Postman/healthcheck) izin ver
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS: Not allowed by policy"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

// --- Rate limit ---
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Healthcheck ---
app.get("/", (req, res) => res.send({ status: "ok", service: "wtwr-api" }));

// --- Routes ---
app.use("/", mainRouter);

// --- Celebrate validation errors ---
app.use(errors());

// --- Global error handler ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.statusCode || INTERNAL_SERVER_ERROR || 500;
  const message =
    status === (INTERNAL_SERVER_ERROR || 500)
      ? "An error has occurred on the server."
      : err.message;
  res.status(status).send({ message });
});

// --- Listen ---
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); // eslint-disable-line no-console
});
