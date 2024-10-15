// userModel.js
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter name"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please enter email"],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
