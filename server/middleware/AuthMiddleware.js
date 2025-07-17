import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("Middleware called");

  console.log("Cookies:", req.cookies); // corrected typo
  const token = req.cookies?.jwt;
  console.log("Token:", token);

  // Example token verification
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next(); // move to the next middleware or route
  } catch (err) {
    return res.status(403).json({ message: "Not valid" });
  }
};
