// models/user.js
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 2, maxlength: 30, default: "User" },
    avatar: {
      type: String,
      default: "",
      validate: {
        validator: (v) => !v || validator.isURL(v, { require_protocol: true }),
        message: "You must enter a valid URL",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "You must enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
  },
  { versionKey: false, timestamps: true }
);

// 🔐 Custom finder: email + password doğrulama
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) throw new Error("AUTH"); // 401
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("AUTH"); // 401
  return user;
};

module.exports = mongoose.model("user", userSchema);
