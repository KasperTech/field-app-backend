const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const asyncHandler = require("./asyncHandler");

const authorizeUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(403, "No authorization token");
  }

  // Decode user's data from token
  const user = jwt.verify(token, process.env.JWT_SECRET);

  // Check if the user has the required role
  if (!user) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  // Attach user data to the request object
  req.user = user;
  req.token = token;

  next();
});

module.exports = { authorizeUser };
