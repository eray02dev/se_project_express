// utils/validators.js
const { celebrate, Joi, Segments } = require("celebrate");

const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

// AUTH
const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    avatar: Joi.string().pattern(urlRegex).optional(),
  }),
});

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

// USERS
const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    // avatar bazı projelerde opsiyonel:
    avatar: Joi.string().pattern(urlRegex).optional(),
  }),
});

// ITEMS
const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().pattern(urlRegex).required(),
  }),
});

const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

// alias (sen routes/users.js'te validateUpdateMe kullanıyorsun)
const validateUpdateMe = validateUpdateUser;

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateUser,
  validateUpdateMe,
  validateCreateItem,
  validateItemId,
};
