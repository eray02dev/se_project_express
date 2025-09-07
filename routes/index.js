// routes/index.js
const router = require("express").Router();

const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");

// ✨ celebrate validatorlar
const { validateSignup, validateSignin } = require("../utils/validators");

// ---- Public routes ----
router.post("/signup", validateSignup, createUser);
router.post("/signin", validateSignin, login);
router.get("/items", getItems); // sadece GET /items public

// ---- Protected routes ----
router.use("/items", auth, itemRouter); // POST/DELETE/like/unlike korumalı
router.use("/users", auth, userRouter);

// ---- 404 fallback ----
router.use("*", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
