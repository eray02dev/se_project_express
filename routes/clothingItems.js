// routes/clothingItems.js
const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const { validateCreateItem, validateItemId } = require("../utils/validators");

// PUBLIC: GET /items (zaten index.js'te public olarak mount ediyorsun)
router.get("/", getItems);

// PROTECTED: (index.js'te router.use('/items', auth, itemRouter))
router.post("/", validateCreateItem, createItem);
router.delete("/:itemId", validateItemId, deleteItem);
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, unlikeItem);

module.exports = router;
