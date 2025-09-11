// routes/clothingItems.js
const router = require("express").Router();
const {
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const { validateCreateItem, validateItemId } = require("../utils/validators");

// NOT: GET /  —> burada TANIMLI DEĞİL (public GET, routes/index.js'te)

// PROTECTED: (index.js'te router.use('/items', auth, itemRouter) ile korunur)
router.post("/", validateCreateItem, createItem);
router.delete("/:itemId", validateItemId, deleteItem);
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, unlikeItem);

module.exports = router;
