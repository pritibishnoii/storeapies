import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  // 2. Fallback to Authorization header (for non-browser clients)
  if (!token && req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  }

  console.log("token from middleware--->", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log("Not authorized, token failed");
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    console.log("No authorized, token failed");
    throw new Error("Not authorized, no token.");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

export { authenticate, authorizeAdmin };
