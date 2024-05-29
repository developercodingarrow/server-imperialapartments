const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");

// Create Simple OTP and encryptedOtp
const HashOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const encryptedOtp = await bcrypt.hash(otp, 12);
  return {
    otp,
    encryptedOtp,
  };
};

// Create url Token & hasToken function
const OtpURL = () => {
  const UrlToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(UrlToken)
    .digest("hex");

  return {
    UrlToken,
    hashedToken,
  };
};

// User Registration
exports.userRegisteraion = catchAsync(async (req, res, next) => {
  // 1) data comes from client
  const { fullName, email, password, passwordConfirm } = req.body;
  // 2) check the is mendatory data is empity
  if ((!fullName || !email || !password, !passwordConfirm)) {
    return next(new AppError("Please Provide Required filed"));
  }
  // 3) Check user already exist or note
  const checkUser = await User.findOne({ email });

  if (!checkUser) {
    // 4) Generate OTP
    const { otp, encryptedOtp } = await HashOTP();
    // 5) Create url Token & hasToken
    const { UrlToken, hashedToken } = OtpURL();
    // 6) create user
    const newUser = await User.create({
      fullName,
      email,
      password,
      otp: encryptedOtp,
      otpTimestamp: new Date(),
      otpgenerateToken: hashedToken,
      isVerified: false,
    });

    const otpverificationURL = `${req.protocal}:://${req.get(
      "host"
    )}/verify-otp/${UrlToken}`;
    // 7) Send email

    await sendEmail({
      email: email,
      subject: "User Registration",
      message: `<h1>This is your one Time  (OTP) ${otp} for registration please use OTP <h1> <br>
                click on this Link ${otpverificationURL} and Verify the OTP`,
    });

    res.status(200).json({
      status: "success",
      apiFor: "register",
      otp, // only for test
      newUser, // only for test
      UrlToken, // only for test
    });
  } else if (checkUser.isVerified === true) {
    return next(new AppError("you have already account Please Login"));
  } else if (checkUser.isVerified === false) {
    // Generate OTP
    const { otp, encryptedOtp } = await HashOTP();
    const { UrlToken, hashedToken } = OtpURL();
    // save in data base again
    checkUser.otpgenerateToken = hashedToken;
    checkUser.otp = encryptedOtp;

    await checkUser.save({ validateBeforeSave: false });

    await sendEmail({
      email: email,
      subject: "User Registration",
      message: `<h1>This is your one Time  (OTP) ${otp} for registration please use OTP <h1> <br>
                click on this Link ${otpverificationURL} and Verify the OTP`,
    });

    res.status(200).json({
      status: "Success",
      apiFor: "register",
      otp,
      UrlToken,
      message: "Registration Successfull",
    });
  }
});

// Verify OTP and activate user's account
exports.verifyOtp = catchAsync(async (req, res, next) => {
  //1) Get user based on the UrlToken
  console.log(req.body.otp);
  console.log(req.params.token);
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // 2) Get the user by hashedToken
  const user = await User.findOne({ otpgenerateToken: hashedToken });

  console.log(user);

  //3) Verify OTP and expiration time
  const currentTime = new Date();

  console.log(currentTime);

  if (
    bcrypt.compare(req.body.otp, user.otp) &&
    currentTime.getTime() - user.otpTimestamp.getTime() <= 6000000
  ) {
    user.otp = undefined;
    user.otpgenerateToken = undefined;
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      status: "Success",
      apiFor: "opt-verification",
      message: "your Registration sucesfully",
    });
  } else {
    return next(new AppError("Invalid OTP or expired. Please try again.", 404));
  }
});

exports.forgatePassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // 1) Check empity input filed
  if (!email) {
    return next(new AppError("Please Provide Required filed"));
  }
  // 2) Check user is exist on our data base
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError(
        "There is no account with this mail please register first by this mail"
      )
    );
  }
  // Generate Url Token and HasedToken
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user Email

  const forgotePasswordURL = `http:://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;
  await sendEmail({
    email: user.email,
    subject: "Reset Password ",
    message: `<h1>for Reste Your password click on this link ${forgotePasswordURL} and  Reset Your Password  <h1> `,
  });

  res.status(200).json({
    status: "Success",
    apiFor: "forgatePassword",
    user,
    resetToken,
  });
});

// Reset the password
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the UrlToken
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2) Get the user by hashedToken
  const user = await User.findOne({
    PasswordResetToken: hashedToken,
    PasswordResetExpires: { $gt: Date.now() },
  });

  //if user not found check user
  if (!user) {
    return next(
      new AppError(
        "password Verification is Invalid or Time Exired Try Again",
        401
      )
    );
  }

  user.password = req.body.password;
  // user.passwordConfirm = req.body.passwordConfirm;
  user.PasswordResetToken = undefined;
  user.PasswordResetExpires = undefined;

  // Save the user new password
  await user.save();

  res.status(200).json({
    status: "Success",
    message: "your password Reset sucesfully",
    apiFor: "resetPassword",
  });
});

//
