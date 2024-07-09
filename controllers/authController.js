const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const { promisify } = require("util");

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

// jwt tooken function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 36000,
  });
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
                click on this Link  and Verify the OTP`,
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
    status: "success",
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

// User Login
exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check input filed isEmpity
  if (!email || !password) {
    return next(new AppError("please provide the mendatories fileds"));
  }

  // Check the user by email and get password also
  const user = await User.findOne({ email: email, isVerified: true }).select(
    "+password"
  );
  // check password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorect email or password", 401));
  }
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    apiFor: "Login",
    token,
    message: "login successfully",
    user,
  });
});

// Protect Route Function
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Your are not logIn Please login to acces"), 401);
  }

  // 2) Verifing Tooken
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user exist means after token is user or delete user
  // id comes from jwt payload
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError("The User token does not blonging to this user", 401)
    );
  }
  // 4) check if user changed password after the token was issued
  if (freshUser.changePasswordAfterToken(decoded.iat)) {
    return next(
      new AppError("user recently change password! please log in again", 401)
    );
  }
  // Grant acces to Protected Route

  req.user = freshUser;
  next();
});

// all to acces user Role
exports.restricTO = (...roles) => {
  return (req, res, next) => {
    // roles in Array
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to acces this", 403)
      );
    }

    next();
  };
};
