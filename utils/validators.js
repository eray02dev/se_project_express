// utils/validators.js
const { celebrate, Joi, Segments } = require("celebrate");

const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

// AUTH
// Name'i İSTEĞE BAĞLI yaptık, avatar için boş string/null'a izin verdik.
const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    avatar: Joi.string().pattern(urlRegex).allow("", null).optional(),
  }),
});

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

// USERS
// Profil güncellemede de avatar boş string/null olabiliyor.
const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().pattern(urlRegex).allow("", null).optional(),
  }),
});

// ITEMS
const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    // gelen değeri otomatik lowercase yapıyoruz, sonra enum’a sokuyoruz
    weather: Joi.string().lowercase().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().pattern(urlRegex).required(),
  }),
});

const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

// alias (routes/users.js içinde validateUpdateMe kullanıyorsun)
const validateUpdateMe = validateUpdateUser;

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateUser,
  validateUpdateMe,
  validateCreateItem,
  validateItemId,
};
