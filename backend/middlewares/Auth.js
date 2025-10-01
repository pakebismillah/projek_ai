import admin from "../config/Firebase.js";
import models from "../models/Models.js";
const { User } = models;

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ where: { firebase_uid: decoded.uid } });
    if (!user) {
      user = await User.create({
        firebase_uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.displayName || decoded.email?.split("@")[0],
        role: "user", // default role
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
