
// create token and saving in cookies


const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //  option for Cookies
  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token).json({
    success: true,
    token,
    user,
  });
};


module.exports = sendToken;