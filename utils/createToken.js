import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.PRIVATE_KEY, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Changed to lax for development
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
