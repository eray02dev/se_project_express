// models/user.js
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "User",
      trim: true,
    },
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
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "You must enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // hash'i asla otomatik dönme
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

// create/save sırasında sadece değiştiyse hashle
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (err) {
    next(err);
  }
});

// findOneAndUpdate ile parola güncelleniyorsa hashle
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() || {};
  const newPassword = update.password || (update.$set && update.$set.password);
  if (!newPassword) return next();
  try {
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    if (update.password) update.password = hashed;
    if (update.$set && update.$set.password) update.$set.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

// Login helper
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) throw new Error("AUTH");
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("AUTH");
  return user;
};

module.exports = mongoose.model("user", userSchema);
