const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require(".././models/user.model");

exports.isAuthenticateUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new ErrorHandler("Please login to access resource of this page", 401)
    );
  }

  const decodeData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodeData.id);

  next();
});
