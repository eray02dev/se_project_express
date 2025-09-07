// controllers/clothingItems.js
const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, FORBIDDEN } = require("../utils/errors");

// küçük yardımcı: hataya statusCode ekleyip next'e gönder
const bubble = (err, code, message) => {
  err.statusCode = code; // eslint-disable-line no-param-reassign
  if (message) err.message = message; // eslint-disable-line no-param-reassign
  return err;
};

// GET /items — public
async function getItems(req, res, next) {
  try {
    const items = await ClothingItem.find({});
    return res.send(items);
  } catch (e) {
    return next(e);
  }
}

// POST /items — protected (owner = req.user._id)
async function createItem(req, res, next) {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).send(item);
  } catch (e) {
    if (e.name === "ValidationError") {
      return next(bubble(e, BAD_REQUEST, "Invalid item data"));
    }
    return next(e);
  }
}

// DELETE /items/:itemId — protected, only owner
async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const requesterId = req.user._id;

    const item = await ClothingItem.findById(itemId).orFail();
    if (!item.owner.equals(requesterId)) {
      return next(
        bubble(
          new Error("Forbidden: you are not the owner of this item"),
          FORBIDDEN
        )
      );
    }

    await item.deleteOne();
    return res.send({ message: "Item deleted", item });
  } catch (e) {
    if (e.name === "CastError") {
      return next(bubble(e, BAD_REQUEST, "Invalid item id"));
    }
    if (e.name === "DocumentNotFoundError") {
      return next(bubble(e, NOT_FOUND, "Item not found"));
    }
    return next(e);
  }
}

// PUT /items/:itemId/likes — protected
async function likeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail();

    return res.send(item);
  } catch (e) {
    if (e.name === "CastError") {
      return next(bubble(e, BAD_REQUEST, "Invalid item id"));
    }
    if (e.name === "DocumentNotFoundError") {
      return next(bubble(e, NOT_FOUND, "Item not found"));
    }
    return next(e);
  }
}

// DELETE /items/:itemId/likes — protected
async function unlikeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail();

    return res.send(item);
  } catch (e) {
    if (e.name === "CastError") {
      return next(bubble(e, BAD_REQUEST, "Invalid item id"));
    }
    if (e.name === "DocumentNotFoundError") {
      return next(bubble(e, NOT_FOUND, "Item not found"));
    }
    return next(e);
  }
}

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
