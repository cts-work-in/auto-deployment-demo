const jwtSecret = process.env.JWT_SECRET_TOKEN;
const jwt = require("jsonwebtoken");
const User = require("../Models/user.jsx");



module.exports.verifyToken = async function (req, res, next) {
  let { authorization } = req.headers;
  console.log("Authorization Header:", authorization);

  if (!authorization) {
    return res.status(400).send({
      status: false,
      message: "No token provided.",
      response: {},
    });
  }

  // Remove "Bearer " prefix
  if (authorization.startsWith("Bearer ")) {
    authorization = authorization.slice(7);
  }

  jwt.verify(authorization, jwtSecret, async function (err, decoded) {
    if (err || !decoded) {
      console.log("Error while decoding token");
      return res.status(401).send({
        status: false,
        message: "User session expired or token is invalid. Please login again!",
        response: {},
      });
    }

    console.log("Decoded Token:", decoded);
    if (!decoded) {
      return res.status(401).send({
        status: false,
        message: "Token does not contain user information or email.",
        response: {},
      });
    }

    console.log("Decoded Email:", decoded.email);
    req.email = decoded.email;
    req.name = decoded.name;
    req.id = decoded.id;

    try {
      const user = await User.findById(req.id);
      if (!user) {
        return res.status(401).send({
          status: false,
          message: "User not found.",
          response: {},
        });
      }

      // Check if the user is blocked
      if (user.isActive == false) {
        return res.status(401).send({
          status: false,
          message: "User has been blocked by admin.",
          response: {},
        });
      }

      const expirationTime = new Date(decoded.exp * 1000);
      const currentTime = new Date();
      if (currentTime > expirationTime) {
        return res.status(401).send({
          status: false,
          message: "Token has expired",
          response: {},
        });
      }

      next();
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).send({
        status: false,
        message: "Internal server error",
        response: {},
      });
    }
  });
};

