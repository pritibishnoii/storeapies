// export default generateToken;
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (res, userId, isAdmin = false) => {
  // Verify PRIVATE_KEY is set
  if (!process.env.PRIVATE_KEY) {
    throw new Error("JWT private key is not configured");
  }

  // Create token with additional useful claims
  const token = jwt.sign(
    {
      userId,
      isAdmin, // Include admin status in token
      iat: Math.floor(Date.now() / 1000), // Issued at timestamp
    },
    process.env.PRIVATE_KEY,
    {
      expiresIn: "30d",
      algorithm: "HS256", // Explicitly specify algorithm
    }
  );

  // Configure cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/", // Accessible across all routes
    domain: process.env.COOKIE_DOMAIN || undefined, // For cross-domain in production
  };

  // Set JWT as HTTP-Only Cookie
  res.cookie("jwt", token, cookieOptions);

  console.log("cookie-->", cookieOptions);
  console.log("token-->", token);
  return token;
};

export default generateToken;
