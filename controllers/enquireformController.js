const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const EnquireForm = require("../models/enquireFormModel");
const Factory = require("../utils/handlerFactory");

// 1) Create Blog Categories
exports.createEnquire = catchAsync(async (req, res, next) => {
  const { userName, email, mobileNumber, message } = req.body;

  if (!userName || !email || !mobileNumber) {
    return next(new AppError("Please Provide Required filed ", 404));
  }
  const enquire = await EnquireForm.create({
    userName,
    email,
    mobileNumber,
    message,
    userIP: req.connection.remoteAddress,
  });
  await enquire.save();

  res.status(200).json({
    status: "Success",
    message: "your enquire sucesfully",
    enquire,
  });
});

// 2) GET ALL CATEGORIES
exports.allEnquire = Factory.getAll(EnquireForm);

// 3) DELETE ONE CATEGORIES
exports.deleteOneEnquire = Factory.deleteOneByBody(EnquireForm);
