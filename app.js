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
  PORT = 3001,
  MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db",
  FRONTEND_URL, // prod için .env'den ver (örn: https://wtwr.example.com)
  FRONTEND_URL_2, // istersen ikinci bir domain daha
} = process.env;

// --- DB ---
mongoose
  .connect(MONGO_URL)
  .then(() => console.warn("Connected to DB")) // eslint-disable-line no-console
  .catch((err) => console.error("DB connection error:", err)); // eslint-disable-line no-console

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
    // Postman/insomnia gibi origin'siz istekleri de kabul et
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS: Not allowed by policy"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
// Preflight
app.options("*", cors(corsOptions));

// --- Rate limit (basic) ---
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Routes ---
app.use("/", mainRouter);

// --- Celebrate validation errors ---
app.use(errors());

// --- Global error handler (must be 4 args) ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.statusCode || INTERNAL_SERVER_ERROR;
  const message =
    status === INTERNAL_SERVER_ERROR
      ? "An error has occurred on the server."
      : err.message;
  res.status(status).send({ message });
});

app.listen(PORT, () => {
  console.warn(`Listening on port ${PORT}`); // eslint-disable-line no-console
});
