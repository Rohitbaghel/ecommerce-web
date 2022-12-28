const ErrorHandler = require("../utils/errorHandler");
const errorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //   Wrong MongoDB error
  if (err.name === "CastError") {
    const message = `Resource Not Found; Invalid ${err.path}`;
    err = new ErrorHandler(message, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Json web Token is invalid, Try again ";
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is Expired, Try again";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};
