// controllers/users.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");

/**
 * POST /signup
 * Kullanıcı oluşturma (email + password hash)
 * - Aynı email varsa 409 döner (pre-check + 11000 fallback)
 */
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Email and password are required" });
    }

    // Duplicate email pre-check (DB'de unique index olmasa bile 409 verir)
    const exists = await User.exists({ email });
    if (exists) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });

    return res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
    }
    return next(err);
  }
};

/**
 * POST /signin
 * Login — custom static ile doğrula ve JWT üret
 */
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch(() => {
      const e = new Error("Incorrect email or password");
      e.statusCode = UNAUTHORIZED;
      return next(e);
    });
};

/**
 * GET /users/me — token'dan kullanıcıyı getir
 */
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch(next);
};

/**
 * PATCH /users/me — adı ve avatarı güncelle
 */
const updateMe = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .select("-password")
    .then((updated) => {
      if (!updated) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(updated);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateMe,
};
