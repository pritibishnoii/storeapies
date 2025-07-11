import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.PRIVATE_KEY, {
    expiresIn: "1d",
  });

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;

//     httpOnly: true ka matlab hai ki cookie sirf server se access ho sakti hai, JavaScript se nahi (security ke liye).
// secure: process.env.NODE_ENV !== "development" ka matlab hai ki production me ye cookie sirf HTTPS pe hi set hogi.
// sameSite: "strict" ka matlab hai ki cookie sirf same site pe hi bheji jayegi (cross-site request me nahi).
// maxAge: 30 * 24 * 60 * 60 * 1000 ka matlab hai 30 din tak cookie valid rahegi.
