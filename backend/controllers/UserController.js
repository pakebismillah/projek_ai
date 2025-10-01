import models from "../models/Models.js";
const { User } = models;

export const getProfile = async (req, res) => {
  try {
    res.json(req.user); // dari middleware
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "firebase_uid", "name", "email", "role", "createdAt"], // jangan expose semua
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
