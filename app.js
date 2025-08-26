const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes");
const { INTERNAL_SERVER_ERROR } = require("./utils/errors"); // ← sabit

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

app.use(express.json());

// Geçici authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: "68ab9dd475518d8dab19e43a", // ← Postman’den aldığın gerçek _id
  };
  next();
});

app.use("/", mainRouter);

// Global error handler (Stage 9 formatı)
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occurred on the server." });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
