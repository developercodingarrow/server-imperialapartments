const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: [true, "Please Tell us your name!"],
    },

    email: {
      type: String,
      require: [true, "Please Provide your email!"],
      unique: true,
      lowercase: true,
    },

    userName: {
      type: String,
      require: [true, "Please Provide Unique User Name!"],
      unique: true,
    },
    bio: {
      type: String,
    },

    role: {
      type: String,
      enum: ["superAdmin", "admin", "employee", "user"],
      default: "user",
    },
    password: {
      type: String,
      require: [true, "please provide your password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      require: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el == this.password;
        },
        message: "confirm password didn't match",
      },
    },

    otp: String,
    otpTimestamp: Date,
    isVerified: Boolean,
    otpgenerateToken: String,
    passwordChangeAt: Date,
    PasswordResetToken: String,
    PasswordResetExpires: Date,
  },
  { timestamps: true }
);

// Create randome user name
userSchema.pre("save", function (next) {
  // Generate a slug from the user's name
  const slug = slugify(this.fullName, { lower: true });
  const randomString = crypto.randomBytes(3).toString("hex");
  this.userName = `${slug}_${randomString}`;

  next();
});

// Hash The Password when new User Register
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.PasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
