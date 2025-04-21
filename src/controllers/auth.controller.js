const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * Register Field User
 * @route [
 *  /api/v1/field-user/auth/register
 * ]
 * @method POST
 * @contentType application/json
 * @authentication false
 * @authorization false
 *
 */
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNo, password } = req.body;

  const existingUser = await User.findOne({ phoneNo });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const newUser = await new User({
    name,
    email,
    phoneNo,
    password,
  }).save();

  const response = {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    phoneNo: newUser.phoneNo,
  };

  res
    .status(201)
    .json(
      new ApiResponse(201, response, "User created successfully")
    );
});




/**
 * Login Field User
 * @route [
 *  /api/v1/field-user/auth/login
 * ]
 * @method POST
 * @contentType application/json
 * @authentication false
 * @authorization false
 *
 */

exports.loginUser = asyncHandler(async (req, res) => {
  const { phoneNo, password } = req.body;
  const userData = await User.findOne({ phoneNo });
  if (!userData) {
    throw new ApiError(401, "User with this phone number does not exists");
  }
  const isAuthorized = await userData.checkPassword(password);
  if (!isAuthorized) {
    throw new ApiError(401, "Invalid password");
  }

  const userInfo = {
    _id: userData._id,
    name: userData.name,
    phoneNo: userData.phoneNo,
  };

  const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: process.env.ADMIN_JWT_EXPIRES_IN,
  });

  const user = {
    _id: userData._id,
    name: userData.name,
    phoneNo: userData.phoneNo,
  };

  return res.json(
    new ApiResponse(200, { user, token }, "User logged in successfully")
  );
});
