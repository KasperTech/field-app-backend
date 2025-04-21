const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env",
});

const userSchema = new mongoose.Schema(
  {
    name: { type: mongoose.Schema.Types.String, required: true },
    email: { type: mongoose.Schema.Types.String },
    phoneNo: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    password: { type: mongoose.Schema.Types.String, required: true },
    isDeleted: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.password) {
    return;
  }
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

userSchema.methods.checkPassword = async function (password) {
  const isAuthorized = await bcrypt.compare(password, this.password);
  return isAuthorized;
};

userSchema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const User = mongoose.model("User", userSchema, "user");

module.exports = User;
