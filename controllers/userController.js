const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Factory = require("../utils/handlerFactory");

// 1) GET ALL Users
exports.allUsers = Factory.getAll(User);

exports.updateUserName = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { fullName: req.body.fullName },
    { new: true, runValidators: false }
  );
  res.status(200).json({
    status: "success",
    message: "Your Name updated successfully",
    user: updatedUser,
  });
});
