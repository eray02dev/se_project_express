const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors"); // ← sabit

router.use("/users", userRouter);
router.use("/items", itemRouter);

// 404 — non-existent route
router.use("*", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;

