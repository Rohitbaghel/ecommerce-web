const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/user.model");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
// Register user
exports.createUser = CatchAsyncErrors(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "12",
      url: "hteep",
    },
  });

  sendToken(user, 201, res);
});

// login user

exports.loginUser = CatchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //   check if email or password is avaiable or not
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Valid email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Emai && password", 401));
  }

  sendToken(user, 200, res);
});

exports.logout = CatchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} is not authorise to access this resources`,
          403
        )
      );
    }
    next();
  };
};

// Forgot Password

exports.forgotPassword = CatchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  // get Reset Password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested to reset password.then Please Ignore it`;

  try {
    await sendMail({
      email: user.email,
      subject: `Eccomerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} Successfully`,
    });
  } catch (error) {
    this.resetPasswordToken = undefined;
    this.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password

exports.resetPassword = CatchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password token in Invalid or has been Expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Password do not match", 400)
    );
  }

  user.password = req.body.password;
  this.resetPasswordToken = undefined;
  this.resetPasswordTokenExpire = undefined;
  await user.save();
  sendToken(user, 201, res);
});

// get user Details
exports.getUserDetails = CatchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// User Password Update
exports.updatePassword = CatchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Please check your password", 401));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 201, res);
});

//  Update User Profile
exports.updateProfile = CatchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // we will add Profile later
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all User (admin)
exports.getAllUser = CatchAsyncErrors(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    success: true,
    user,
  });
});

// Get Single User (admin)
exports.getSingleUser = CatchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User doens't exist with user id", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//  Update User role --admin
exports.updateUserRole = CatchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --admin

exports.deleteUser = CatchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User doens't exist with user id: ${req.params.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted Successfully",
  });
});
